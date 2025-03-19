import pandas as pd
import json
from datetime import datetime

def process_quiz_data(csv_file):
    """
    Processes quiz data, handles duplicates, separates quiz data by question type,
    calculates correct/total counts for MCQs and T/F questions, extracts
    short answer questions and answers into separate columns, and calculates
    course-specific scores for MCQs and T/F questions.

    Args:
        csv_file (str): Path to the CSV file containing quiz data.

    Returns:
        pandas.DataFrame: DataFrame with all processed data.
    """

    df = pd.read_csv(csv_file)
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    # Deduplication (same as before)
    df['UniqueKey'] = df['StudentID'].astype(str) + '_' + df['CourseID'].astype(str) + '_' + \
                      df['QuizID'].astype(str) + '_' + df['QuestionID'].astype(str)
    df = df.sort_values('Timestamp').drop_duplicates(subset=['UniqueKey'], keep='last')
    df = df.drop('UniqueKey', axis=1)

    # Data Restructuring and Aggregation (modified)
    def aggregate_quiz_data(group):
        multiple_choice_responses = []
        true_false_responses = []
        short_answer_responses = []
        
        # Improved TestBank detection - much more lenient
        test_bank = 'Uncertain'
        if 'TestBank' in group.columns:
            # Get all unique test banks except 'Uncertain'
            valid_test_banks = [tb for tb in group['TestBank'].unique() if tb != 'Uncertain']
            if valid_test_banks:
                # Use the first valid test bank found (if any question has a valid test bank)
                test_bank = valid_test_banks[0]
        
        # Track which questions belong to which test bank for debugging
        test_bank_mapping = {}

        for _, row in group.iterrows():
            question_data = {
                'QuizID': row['QuizID'],
                'QuestionID': row['QuestionID'],
                'QuestionType': row['QuestionType'],
                'QuestionText': row['QuestionText'],
                'Answer': row['Answer'],
                'CorrectAnswer': row['CorrectAnswer'],
                'Correct': row['Correct'],
                'Points': row['Points']
            }
            
            # Record this question's test bank for tracking
            if 'TestBank' in row:
                test_bank_mapping[row['QuestionID']] = row['TestBank']
                
                # If this question has a non-Uncertain test bank, use it
                if row['TestBank'] != 'Uncertain':
                    test_bank = row['TestBank']
            
            # Add the determined test bank to the question data
            question_data['TestBank'] = test_bank

            if row['QuestionType'] == 'multiple_choice':
                multiple_choice_responses.append(question_data)
            elif row['QuestionType'] == 'true_false':
                true_false_responses.append(question_data)
            elif row['QuestionType'] == 'short_answer':
                short_answer_responses.append(question_data)

        # For debugging, include the test bank mapping in metadata if needed
        # metadata = {'test_bank_mapping': test_bank_mapping}

        return (json.dumps(multiple_choice_responses, indent=2),
                json.dumps(true_false_responses, indent=2),
                json.dumps(short_answer_responses, indent=2),
                test_bank)  # Return the determined test bank

    # Apply the aggregation and prepare columns for test bank
    result = df.groupby(['StudentID', 'CourseID']).apply(aggregate_quiz_data)
    grouped = pd.DataFrame(result.tolist(), index=result.index, 
                          columns=['MultipleChoiceData', 'TrueFalseData', 'ShortAnswerData', 'TestBank'])
    grouped.reset_index(inplace=True)

    # Calculate MultipleChoiceCorrect and MultipleChoiceTotal with improved error handling
    def calculate_mcq_stats(json_data):
        try:
            data = json.loads(json_data)
            correct_count = 0
            total_count = 0
            for item in data:
                # More robust handling of 'Correct' field
                correct_value = str(item.get('Correct', '')).strip().lower()
                if correct_value in ('yes', 'true', '1'):
                    correct_count += 1
                total_count += 1
            return correct_count, total_count
        except (json.JSONDecodeError, TypeError):
            return 0, 0  # Handle empty or invalid JSON

    grouped[['MultipleChoiceCorrect', 'MultipleChoiceTotal']] = grouped['MultipleChoiceData'].apply(
        calculate_mcq_stats).tolist()

    # Calculate TrueFalseCorrect and TrueFalseTotal
    def calculate_tf_stats(json_data):
        try:
            data = json.loads(json_data)
            correct_count = 0
            total_count = 0
            for item in data:
                # More robust handling of 'Correct' field
                correct_value = str(item.get('Correct', '')).strip().lower()
                if correct_value in ('yes', 'true', '1'):
                    correct_count += 1
                total_count += 1
            return correct_count, total_count
        except (json.JSONDecodeError, TypeError):
            return 0, 0  # Handle empty or invalid JSON

    grouped[['TrueFalseCorrect', 'TrueFalseTotal']] = grouped['TrueFalseData'].apply(calculate_tf_stats).tolist()

    # Extract Short Answer Data
    max_short_answers = 0
    for json_str in grouped['ShortAnswerData']:
        try:
            short_answers = json.loads(json_str)
            max_short_answers = max(max_short_answers, len(short_answers))  #Find maximum number of short answer questions
        except (json.JSONDecodeError, TypeError):
            pass #Handle if parsing fails

    for i in range(1, max_short_answers + 1): #Create new columns
        grouped[f'ShortQ{i}'] = ''
        grouped[f'ShortA{i}'] = ''
        grouped[f'ShortA{i}_score'] = '-'  # Initialize with '-'
        grouped[f'ShortA{i}_feedback'] = '-' # Initialize with '-'


    for index, row in grouped.iterrows(): #Populate new columns
        try:
            short_answers = json.loads(row['ShortAnswerData'])
            for i, q in enumerate(short_answers):
                grouped.at[index, f'ShortQ{i+1}'] = q['QuestionText']
                grouped.at[index, f'ShortA{i+1}'] = q['Answer']
        except (json.JSONDecodeError, TypeError):
            pass #Handles rows that fail to parse

    # --- Calculate Scores (Course-Specific) ---
    if len(grouped['CourseID'].unique()) > 1:
        grouped = grouped.sort_values('CourseID')

    # Initialize score columns
    grouped['MultipleChoiceScore'] = ''
    grouped['TrueFalseScore'] = ''
    grouped['MultipleChoiceRatio'] = ''  # Add a pure ratio column
    grouped['TrueFalseRatio'] = ''       # Add a pure ratio column
    
    # Group by both CourseID and TestBank if TestBank column exists
    if 'TestBank' in grouped.columns and not grouped['TestBank'].isna().all():
        # Fill missing TestBank values
        grouped['TestBank'] = grouped['TestBank'].fillna('Uncertain')
        
        # Add debug column showing test bank distribution if needed
        # grouped['TestBankInfo'] = grouped.apply(
        #     lambda row: f"{row['TestBank']} (MC: {json.loads(row['MultipleChoiceData'])[0]['TestBank'] if json.loads(row['MultipleChoiceData']) else 'None'})",
        #     axis=1
        # )
        
        # Calculate scores based on grouping
        max_mcq_total = grouped.groupby(['CourseID', 'TestBank'])['MultipleChoiceTotal'].transform('max')
        max_tf_total = grouped.groupby(['CourseID', 'TestBank'])['TrueFalseTotal'].transform('max')
        
        # Also calculate individual ratios (not scaled by max)
        with pd.option_context('mode.chained_assignment', None):
            mask = grouped['MultipleChoiceTotal'] > 0
            grouped.loc[mask, 'MultipleChoiceRatio'] = (
                grouped.loc[mask, 'MultipleChoiceCorrect'] / grouped.loc[mask, 'MultipleChoiceTotal']
            ).round(2)
            
            mask = grouped['TrueFalseTotal'] > 0
            grouped.loc[mask, 'TrueFalseRatio'] = (
                grouped.loc[mask, 'TrueFalseCorrect'] / grouped.loc[mask, 'TrueFalseTotal']
            ).round(2)
    else:
        # Original behavior if TestBank column doesn't exist
        max_mcq_total = grouped.groupby('CourseID')['MultipleChoiceTotal'].transform('max')
        max_tf_total = grouped.groupby('CourseID')['TrueFalseTotal'].transform('max')
        
        # Also calculate individual ratios
        with pd.option_context('mode.chained_assignment', None):
            mask = grouped['MultipleChoiceTotal'] > 0
            grouped.loc[mask, 'MultipleChoiceRatio'] = (
                grouped.loc[mask, 'MultipleChoiceCorrect'] / grouped.loc[mask, 'MultipleChoiceTotal']
            ).round(2)
            
            mask = grouped['TrueFalseTotal'] > 0
            grouped.loc[mask, 'TrueFalseRatio'] = (
                grouped.loc[mask, 'TrueFalseCorrect'] / grouped.loc[mask, 'TrueFalseTotal']
            ).round(2)
    
    # Calculate scores (normalized by max totals)
    grouped['MultipleChoiceScore'] = (grouped['MultipleChoiceCorrect'] / max_mcq_total).round(2)
    grouped['TrueFalseScore'] = (grouped['TrueFalseCorrect'] / max_tf_total).round(2)
    
    # Replace inf with NA
    grouped['MultipleChoiceScore'] = grouped['MultipleChoiceScore'].replace([float('inf'), float('-inf')], pd.NA)
    grouped['TrueFalseScore'] = grouped['TrueFalseScore'].replace([float('inf'), float('-inf')], pd.NA)
    grouped['MultipleChoiceRatio'] = grouped['MultipleChoiceRatio'].replace([float('inf'), float('-inf')], pd.NA)
    grouped['TrueFalseRatio'] = grouped['TrueFalseRatio'].replace([float('inf'), float('-inf')], pd.NA)
    
    return grouped


if __name__ == "__main__":
    csv_file = r"C:\Users\micah\Downloads\Week 1 Quizzes\quiz_results_summary_w1.csv"  # Use a raw string for Windows paths
    processed_data = process_quiz_data(csv_file)

    # Replace empty strings and NaN with "NA"
    processed_data = processed_data.fillna("NA")
    processed_data = processed_data.replace("", "NA")
    

    # Output the processed DataFrame as a CSV
    output_csv_path = r"C:\Users\micah\Downloads\Week 1 Quizzes\processed_quiz_data_final.csv"
    processed_data.to_csv(output_csv_path, index=False)
    print(f"Processed quiz data CSV saved to {output_csv_path}")

    print("Processed Quiz Data:")
    print(processed_data)