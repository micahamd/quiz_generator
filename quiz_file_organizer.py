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
        
        # Determine a single TestBank for the entire group (student_id, course_id).
        # Assumes quiz_processor.py has populated the TestBank column consistently for the group.
        group_test_bank = 'Uncertain' # Default
        if 'TestBank' in group.columns:
            # Get all non-NaN, non-empty string, and non-'Uncertain' test bank names
            # Convert to string first to handle mixed types and allow .strip()
            specific_test_banks = [
                str(tb) for tb in group['TestBank'].dropna().unique() 
                if str(tb).strip() and str(tb) != 'Uncertain'
            ]

            if specific_test_banks:
                group_test_bank = specific_test_banks[0] # Use the first specific test bank found
                if len(specific_test_banks) > 1:
                    # Print a warning if multiple different specific test banks are found for the same group
                    student_id_str = group.name[0] if isinstance(group.name, tuple) and len(group.name) > 0 else "Unknown Student"
                    course_id_str = group.name[1] if isinstance(group.name, tuple) and len(group.name) > 1 else "Unknown Course"
                    print(f"Warning: Group (Student: {student_id_str}, Course: {course_id_str}) has multiple distinct specific TestBanks: {specific_test_banks}. Using '{group_test_bank}'.")
            # If no specific_test_banks are found, group_test_bank remains 'Uncertain'.
            # This covers cases where all TestBank entries for the group are NaN, empty strings, or 'Uncertain'.
        
        for _, row in group.iterrows():
            question_data = {
                'QuizID': row['QuizID'],
                'QuestionID': row['QuestionID'],
                'QuestionType': row['QuestionType'],
                'QuestionText': row['QuestionText'], # Should be populated by quiz_processor
                'Answer': row['Answer'],
                'CorrectAnswer': row['CorrectAnswer'], # Should be populated by quiz_processor
                'Correct': row['Correct'],
                'Points': row['Points'],
                'TestBank': group_test_bank # Assign the single determined group_test_bank
            }

            if row['QuestionType'] == 'multiple_choice':
                multiple_choice_responses.append(question_data)
            elif row['QuestionType'] == 'true_false':
                true_false_responses.append(question_data)
            elif row['QuestionType'] == 'short_answer':
                short_answer_responses.append(question_data)

        return (json.dumps(multiple_choice_responses, indent=2),
                json.dumps(true_false_responses, indent=2),
                json.dumps(short_answer_responses, indent=2),
                group_test_bank)  # Return the single determined group_test_bank

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

    # Initialize only ratio columns
    grouped['MultipleChoiceRatio'] = ''  # Add a pure ratio column
    grouped['TrueFalseRatio'] = ''       # Add a pure ratio column
    
    # Group by both CourseID and TestBank if TestBank column exists
    if 'TestBank' in grouped.columns and not grouped['TestBank'].isna().all():
        # Fill missing TestBank values
        grouped['TestBank'] = grouped['TestBank'].fillna('Uncertain')
        
        # Calculate individual ratios (not scaled by max)
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
    
    # Replace inf with NA for ratio columns
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