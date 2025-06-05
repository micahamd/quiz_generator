import json
import csv
import os
import glob
import tkinter as tk
from tkinter import filedialog, ttk, messagebox, simpledialog
from datetime import datetime
import threading
import pickle
# Import process_quiz_data from quiz_file_organizer
from quiz_file_organizer import process_quiz_data

def determine_question_type(question_data):
    """Determine the question type based on available fields."""
    if 'correct' in question_data:
        return 'multiple_choice' if question_data.get('answer', '').lower() in 'abcdefgh' else 'true_false'
    else:
        return 'short_answer'

def get_question_details(question_id, test_banks, course_id):
    """Get question details from test bank based on question ID"""
    if not test_banks or not course_id or course_id == "Not Found":
        return None
    
    # Find the test banks associated with this course
    course_test_banks = []
    for bank_name, bank_info in test_banks.items():
        if bank_info.get('course') == course_id or bank_info.get('course') in course_id.split('/'):
            course_test_banks.append((bank_name, bank_info.get('data', {})))
    
    if not course_test_banks:
        return None
    
    # Search each test bank for the question
    for bank_name, bank in course_test_banks:
        quizzes = bank.get('quizzes', {})
        for quiz_id, quiz_data in quizzes.items():
            questions = quiz_data.get('questions', [])
            for question in questions:
                if str(question.get('id', '')) == str(question_id):
                    return {
                        'question_text': question.get('question', ''),
                        'type': question.get('type', ''),
                        'correct_answer': question.get('correctAnswer', ''),
                        'options': question.get('options', []),
                        'points': question.get('points', 0),
                        'test_bank': bank_name  # Add the test bank name
                    }
    
    return None

def process_quiz_file(file_path, course_mappings=None, test_banks=None):
    """Process a single quiz result JSON file."""
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        
        student_id_original_case = data.get('studentId', 'Unknown') # MODIFIED
        student_id_for_lookup = student_id_original_case.lower() # ADDED
        timestamp = data.get('timestamp', '')
        results = data.get('results', [])
        
        # Determine course based on student ID
        course_id = "Not Found"
        if course_mappings:
            matching_courses = []
            for course_name, student_ids in course_mappings.items():
                if student_id_for_lookup in student_ids: # MODIFIED
                    matching_courses.append(course_name)
            if matching_courses:
                course_id = "/".join(matching_courses)
        
        processed_results = []
        for result in results:
            quiz_id = result.get('quizId', 'Unknown')
            question_id = result.get('questionId', 'Unknown')
            answer = result.get('answer', '')
            points = result.get('points', 0)
            
            # Determine question type
            question_type = determine_question_type(result)
            
            # Get question details from test bank if available
            question_details = None
            if test_banks:
                question_details = get_question_details(question_id, test_banks, course_id)
            
            # Format result based on question type
            result_dict = {
                'StudentID': student_id_original_case, # MODIFIED
                'CourseID': course_id,
                'Timestamp': timestamp,
                'QuizID': quiz_id,
                'QuestionID': question_id,
                'QuestionType': question_type,
                'Answer': answer,
                'Points': points,
                'TestBank': question_details.get('test_bank', 'Uncertain') if question_details else 'Uncertain'
            }
            
            # Add question details from test bank if available
            if question_details:
                result_dict['QuestionText'] = question_details.get('question_text', 'Detail N/A') # MODIFIED
                result_dict['CorrectAnswer'] = question_details.get('correct_answer', 'Detail N/A') # MODIFIED
                options_list = question_details.get('options', []) # ADDED
                result_dict['Options'] = '; '.join(options_list) if options_list else 'Detail N/A' # MODIFIED
            else: # ADDED BLOCK
                result_dict['QuestionText'] = 'Not Found in Test Bank'
                result_dict['CorrectAnswer'] = 'Not Found in Test Bank'
                result_dict['Options'] = 'Not Found in Test Bank'
            
            # Add correctness info if available
            if 'correct' in result:
                result_dict['Correct'] = 'Yes' if result['correct'] else 'No'
            else:
                result_dict['Correct'] = 'N/A (Short Answer)'
                
            processed_results.append(result_dict)
            
        return processed_results
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return []

def export_to_csv(results, output_file):
    """Export processed results to a CSV file."""
    if not results:
        print("No results to export")
        return False
    
    # Determine all possible fieldnames from the results
    all_fields = set()
    for result in results:
        all_fields.update(result.keys())
    
    # Ensure these fields come first in a specific order
    ordered_fields = ['StudentID', 'CourseID', 'Timestamp', 'QuizID', 'QuestionID', 
                     'QuestionType', 'QuestionText', 'Answer', 'CorrectAnswer', 'Correct', 'Points']
    
    # Add any additional fields that might be in the results
    fieldnames = [f for f in ordered_fields if f in all_fields]
    fieldnames.extend(sorted(f for f in all_fields if f not in ordered_fields))
    
    try:
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for result in results:
                writer.writerow(result)
        return True
    except Exception as e:
        print(f"Error exporting to CSV: {e}")
        return False

def process_files(file_paths, output_dir=None, course_mappings=None, test_banks=None):
    """Process multiple selected quiz files."""
    if output_dir is None:
        output_dir = os.path.dirname(file_paths[0]) if file_paths else os.getcwd()
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process each file
    all_results = []
    for json_file in file_paths:
        print(f"Processing {json_file}...")
        results = process_quiz_file(json_file, course_mappings, test_banks)
        all_results.extend(results)
    
    # Export all results to a single CSV file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(output_dir, f"quiz_results_summary_{timestamp}.csv")
    
    if export_to_csv(all_results, output_file):
        print(f"Results successfully exported to {output_file}")
        return output_file
    return None

def process_directory(input_dir, output_dir=None, course_mappings=None, test_banks=None):
    """Process all JSON quiz files in a directory."""
    if output_dir is None:
        output_dir = input_dir
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all JSON files in the directory
    json_files = glob.glob(os.path.join(input_dir, '*_s*.json'))
    
    if not json_files:
        print(f"No quiz result JSON files found in {input_dir}")
        return None
    
    return process_files(json_files, output_dir, course_mappings, test_banks)

class QuizProcessorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Quiz Results Processor")
        self.root.geometry("700x600")  # Made larger to accommodate test bank mapping
        self.root.resizable(True, True)
        
        # Load saved mappings if they exist
        self.data_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "quiz_processor_data.pkl")
        self.load_saved_data()
        
        self.create_widgets()
        self.selected_files = []
        self.output_directory = None
        
    def load_saved_data(self):
        """Load saved course and test bank mappings"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'rb') as f:
                    data = pickle.load(f)
                    self.course_mappings = data.get('course_mappings', {})
                    self.test_banks = data.get('test_banks', {})
            else:
                self.course_mappings = {}
                self.test_banks = {}
        except Exception as e:
            print(f"Error loading saved data: {e}")
            self.course_mappings = {}
            self.test_banks = {}
    
    def save_data(self):
        """Save course and test bank mappings"""
        try:
            data = {
                'course_mappings': self.course_mappings,
                'test_banks': self.test_banks
            }
            with open(self.data_file, 'wb') as f:
                pickle.dump(data, f)
        except Exception as e:
            print(f"Error saving data: {e}")
        
    def create_widgets(self):
        # Create main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = ttk.Label(main_frame, text="Quiz Results Processor", font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=3, pady=10, sticky=tk.W)
        
        # File selection section
        file_frame = ttk.LabelFrame(main_frame, text="Input Selection", padding="10")
        file_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5, padx=5)
        
        ttk.Button(file_frame, text="Select Files", command=self.select_files).grid(row=0, column=0, padx=5, pady=5)
        ttk.Button(file_frame, text="Select Folder", command=self.select_folder).grid(row=0, column=1, padx=5, pady=5)
        ttk.Button(file_frame, text="Clear Selection", command=self.clear_selection).grid(row=0, column=2, padx=5, pady=5)
        
        # Course Mapping section
        course_frame = ttk.LabelFrame(main_frame, text="Course Mappings", padding="10")
        course_frame.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5, padx=5)
        
        ttk.Button(course_frame, text="ID-Course Mapping", command=self.id_course_mapping).grid(row=0, column=0, padx=5, pady=5)
        ttk.Button(course_frame, text="Clear Mappings", command=self.clear_mappings).grid(row=0, column=1, padx=5, pady=5)
        
        # Course mapping display
        course_list_frame = ttk.Frame(course_frame)
        course_list_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        self.course_list_var = tk.StringVar(value="No course mappings loaded")
        self.course_list_label = ttk.Label(course_list_frame, textvariable=self.course_list_var, wraplength=650)
        self.course_list_label.pack(fill=tk.X, expand=True)
        
        # Test Bank Mapping section
        test_bank_frame = ttk.LabelFrame(main_frame, text="Test Bank Mappings", padding="10")
        test_bank_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5, padx=5)
        
        ttk.Button(test_bank_frame, text="Test Bank Mapping", command=self.test_bank_mapping).grid(row=0, column=0, padx=5, pady=5)
        ttk.Button(test_bank_frame, text="Clear Test Banks", command=self.clear_test_banks).grid(row=0, column=1, padx=5, pady=5)
        
        # Test bank mapping display
        test_bank_list_frame = ttk.Frame(test_bank_frame)
        test_bank_list_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        self.test_bank_list_var = tk.StringVar(value="No test banks loaded")
        self.test_bank_list_label = ttk.Label(test_bank_list_frame, textvariable=self.test_bank_list_var, wraplength=650)
        self.test_bank_list_label.pack(fill=tk.X, expand=True)
        
        # Files list
        files_frame = ttk.LabelFrame(main_frame, text="Selected Files", padding="10")
        files_frame.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5, padx=5)
        files_frame.columnconfigure(0, weight=1)
        files_frame.rowconfigure(0, weight=1)
        
        self.file_list = tk.Listbox(files_frame, height=8, selectmode=tk.EXTENDED)
        self.file_list.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Scrollbar for files list
        scrollbar = ttk.Scrollbar(files_frame, orient=tk.VERTICAL, command=self.file_list.yview)
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.file_list['yscrollcommand'] = scrollbar.set
        
        # Output directory selection
        output_frame = ttk.LabelFrame(main_frame, text="Output Options", padding="10")
        output_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5, padx=5)
        
        ttk.Label(output_frame, text="Output Directory:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.output_dir_var = tk.StringVar(value="Same as input")
        self.output_dir_entry = ttk.Entry(output_frame, textvariable=self.output_dir_var, width=40)
        self.output_dir_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=5)
        ttk.Button(output_frame, text="Browse...", command=self.select_output_dir).grid(row=0, column=2, padx=5)
        
        # Process buttons frame
        buttons_frame = ttk.Frame(main_frame, padding="10")
        buttons_frame.grid(row=6, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        # Process button
        self.process_button = ttk.Button(buttons_frame, text="Process Files", command=self.process_selected_files)
        self.process_button.grid(row=0, column=0, padx=5)
        
        # Add checkbox for pre-processing
        self.preprocess_var = tk.BooleanVar(value=False)
        self.preprocess_checkbox = ttk.Checkbutton(
            buttons_frame, 
            text="Pre-process raw data?", 
            variable=self.preprocess_var
        )
        self.preprocess_checkbox.grid(row=0, column=1, padx=5)
        
        # Exit button
        ttk.Button(buttons_frame, text="Exit", command=self.root_destroy).grid(row=0, column=2, padx=5)
        
        # Progress bar
        progress_frame = ttk.Frame(main_frame, padding="10")
        progress_frame.grid(row=7, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        ttk.Label(progress_frame, text="Progress:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.progress_bar = ttk.Progressbar(progress_frame, mode="indeterminate")
        self.progress_bar.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=5)
        
        # Status label
        self.status_var = tk.StringVar(value="Ready")
        status_label = ttk.Label(main_frame, textvariable=self.status_var)
        status_label.grid(row=8, column=0, columnspan=3, pady=5, sticky=(tk.W, tk.E))
        
        # Configure grid weights
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(4, weight=1)  # Files list should expand
        
        # Update displays for saved data
        self.update_course_list_display()
        self.update_test_bank_list_display()
    
    def root_destroy(self):
        """Save data and destroy the root window"""
        self.save_data()
        self.root.destroy()

    def select_files(self):
        files = filedialog.askopenfilenames(
            title="Select Quiz JSON Files",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        if files:
            self.selected_files = list(files)
            self.update_file_list()
    
    def select_folder(self):
        folder = filedialog.askdirectory(title="Select Folder with Quiz JSON Files")
        if folder:
            json_files = glob.glob(os.path.join(folder, '*_s*.json'))
            if not json_files:
                messagebox.showwarning(
                    "No Files Found", 
                    "No quiz result JSON files found in the selected folder."
                )
            else:
                self.selected_files = json_files
                self.update_file_list()
    
    def clear_selection(self):
        self.selected_files = []
        self.update_file_list()
    
    def update_file_list(self):
        self.file_list.delete(0, tk.END)
        for file in self.selected_files:
            self.file_list.insert(tk.END, os.path.basename(file))
    
    def select_output_dir(self):
        directory = filedialog.askdirectory(title="Select Output Directory")
        if directory:
            self.output_directory = directory
            self.output_dir_var.set(directory)
    
    def id_course_mapping(self):
        """Handle the ID-Course mapping functionality"""
        # Open file dialog to select a text file with student IDs
        file_path = filedialog.askopenfilename(
            title="Select Student ID List",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if not file_path:
            return
            
        # Ask for course name
        default_name = os.path.basename(file_path).split('.')[0]
        course_name = simpledialog.askstring(
            "Course Name", 
            "Enter a name for this course:",
            initialvalue=default_name
        )
        
        if not course_name:
            return
            
        # Read student IDs from the file
        try:
            with open(file_path, 'r') as f:
                student_ids = [line.strip().lower() for line in f if line.strip()] # MODIFIED
                
            # Add to mappings
            self.course_mappings[course_name] = student_ids
            self.update_course_list_display()
            
            # Save the updated data
            self.save_data()
            
            messagebox.showinfo(
                "Mapping Added", 
                f"Added {len(student_ids)} student IDs for course '{course_name}'"
            )
        except Exception as e:
            messagebox.showerror("Error", f"Failed to read student ID file: {e}")
    
    def clear_mappings(self):
        """Clear all course mappings"""
        if self.course_mappings:
            if messagebox.askyesno("Clear Mappings", "Are you sure you want to clear all course mappings?"):
                # Check if any test banks depend on these courses
                if self.test_banks:
                    if messagebox.askyesno("Warning", 
                                         "Clearing course mappings will also clear all test bank mappings. Continue?"):
                        self.course_mappings = {}
                        self.test_banks = {}
                        self.update_course_list_display()
                        self.update_test_bank_list_display()
                        # Save the updated data
                        self.save_data()
                        messagebox.showinfo("Mappings Cleared", "All course mappings and test banks have been cleared")
                else:
                    self.course_mappings = {}
                    self.update_course_list_display()
                    # Save the updated data
                    self.save_data()
                    messagebox.showinfo("Mappings Cleared", "All course mappings have been cleared")
    
    def update_course_list_display(self):
        """Update the display of loaded course mappings"""
        if not self.course_mappings:
            self.course_list_var.set("No course mappings loaded")
        else:
            mapping_text = []
            for course, ids in self.course_mappings.items():
                mapping_text.append(f"{course} list updated ({len(ids)} students)")
            self.course_list_var.set(", ".join(mapping_text))
    
    def test_bank_mapping(self):
        """Handle the Test Bank mapping functionality"""
        # Open file dialog to select a test bank JSON file
        file_path = filedialog.askopenfilename(
            title="Select Test Bank JSON File",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if not file_path:
            return
            
        # Ask for test bank name
        default_name = os.path.basename(file_path).split('.')[0]
        bank_name = simpledialog.askstring(
            "Test Bank Name", 
            "Enter a name for this test bank:",
            initialvalue=default_name
        )
        
        if not bank_name:
            return
        
        # Ask which course this test bank belongs to
        course_options = list(self.course_mappings.keys()) if self.course_mappings else []
        if not course_options:
            messagebox.showwarning(
                "No Courses Available", 
                "Please create at least one course mapping before adding a test bank."
            )
            return
        
        # Create a simple dialog to select a course
        course_dialog = tk.Toplevel(self.root)
        course_dialog.title("Select Course")
        course_dialog.geometry("300x200")
        course_dialog.transient(self.root)
        course_dialog.grab_set()
        
        ttk.Label(course_dialog, text="Select the course for this test bank:").pack(pady=10)
        
        course_var = tk.StringVar()
        course_combo = ttk.Combobox(course_dialog, textvariable=course_var)
        course_combo['values'] = course_options
        course_combo.pack(pady=10, padx=20, fill=tk.X)
        
        if course_options:
            course_combo.current(0)
        
        def on_ok():
            nonlocal course_var
            course_dialog.course_selected = course_var.get()
            course_dialog.destroy()
        
        def on_cancel():
            course_dialog.course_selected = None
            course_dialog.destroy()
        
        btn_frame = ttk.Frame(course_dialog)
        btn_frame.pack(pady=10, fill=tk.X)
        
        ttk.Button(btn_frame, text="OK", command=on_ok).pack(side=tk.LEFT, padx=20)
        ttk.Button(btn_frame, text="Cancel", command=on_cancel).pack(side=tk.RIGHT, padx=20)
        
        # Center dialog
        course_dialog.update_idletasks()
        width = course_dialog.winfo_width()
        height = course_dialog.winfo_height()
        x = (course_dialog.winfo_screenwidth() // 2) - (width // 2)
        y = (course_dialog.winfo_screenheight() // 2) - (height // 2)
        course_dialog.geometry(f'{width}x{height}+{x}+{y}')
        
        self.root.wait_window(course_dialog)
        
        # Check if course was selected
        if not hasattr(course_dialog, 'course_selected') or not course_dialog.course_selected:
            return
        
        selected_course = course_dialog.course_selected
        
        # Read test bank JSON
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                test_bank_data = json.load(f)
                
            # Add to test banks
            self.test_banks[bank_name] = {
                'course': selected_course,
                'file_path': file_path,
                'data': test_bank_data
            }
            self.update_test_bank_list_display()
            
            # Save the updated data
            self.save_data()
            
            messagebox.showinfo(
                "Test Bank Added", 
                f"Added test bank '{bank_name}' for course '{selected_course}'"
            )
        except Exception as e:
            messagebox.showerror("Error", f"Failed to read test bank file: {e}")
    
    def clear_test_banks(self):
        """Clear all test bank mappings"""
        if self.test_banks:
            if messagebox.askyesno("Clear Test Banks", "Are you sure you want to clear all test bank mappings?"):
                self.test_banks = {}
                self.update_test_bank_list_display()
                # Save the updated data
                self.save_data()
                messagebox.showinfo("Test Banks Cleared", "All test bank mappings have been cleared")
    
    def update_test_bank_list_display(self):
        """Update the display of loaded test banks"""
        if not self.test_banks:
            self.test_bank_list_var.set("No test banks loaded")
        else:
            mapping_text = []
            for bank_name, bank_info in self.test_banks.items():
                course = bank_info.get('course', 'Unknown')
                mapping_text.append(f"{bank_name} for course '{course}'")
            self.test_bank_list_var.set(", ".join(mapping_text))
    
    def process_selected_files(self):
        if not self.selected_files:
            messagebox.showwarning("No Files", "Please select files or a folder first.")
            return
        
        output_dir = self.output_directory if self.output_directory else None
        if self.output_dir_var.get() != "Same as input" and not self.output_directory:
            messagebox.showwarning("Invalid Output", "Please select a valid output directory.")
            return
        
        # Disable buttons during processing
        self.process_button.config(state=tk.DISABLED)
        self.progress_bar.start()
        self.status_var.set("Processing files...")
        
        # Run processing in a separate thread to avoid freezing the UI
        def process_thread():
            output_file = process_files(
                self.selected_files, 
                output_dir, 
                self.course_mappings if self.course_mappings else None,
                self.test_banks if self.test_banks else None
            )
            
            # Apply additional processing if checkbox is checked
            if output_file and self.preprocess_var.get():
                try:
                    self.status_var.set("Pre-processing data...")
                    processed_data = process_quiz_data(output_file)
                    # Replace original file extension with '_processed.csv'
                    base_path = os.path.splitext(output_file)[0]
                    processed_output = f"{base_path}_processed.csv"
                    
                    # Fill NaN values with "NA" for consistency
                    processed_data = processed_data.fillna("NA")
                    processed_data = processed_data.replace("", "NA")
                    
                    processed_data.to_csv(processed_output, index=False)
                    output_file = processed_output  # Update output_file to the processed version
                    self.status_var.set("Pre-processing complete!")
                except Exception as e:
                    print(f"Error during pre-processing: {e}")
                    self.status_var.set(f"Pre-processing error: {str(e)}")
            
            # Update UI from the main thread
            self.root.after(0, lambda: self.processing_complete(output_file))
        
        thread = threading.Thread(target=process_thread)
        thread.daemon = True
        thread.start()
    
    def processing_complete(self, output_file):
        self.progress_bar.stop()
        self.process_button.config(state=tk.NORMAL)
        
        if output_file:
            self.status_var.set(f"Processing complete! Output saved to: {os.path.basename(output_file)}")
            messagebox.showinfo(
                "Processing Complete", 
                f"Quiz results have been processed and saved to:\n{output_file}"
            )
        else:
            self.status_var.set("Processing failed. Check console for details.")
            messagebox.showerror(
                "Processing Failed", 
                "Failed to process quiz results. Please check the console for error messages."
            )

def run_gui():
    root = tk.Tk()
    app = QuizProcessorGUI(root)
    root.mainloop()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Process quiz result JSON files and export to CSV')
    parser.add_argument('--gui', '-g', action='store_true', help='Run with graphical user interface')
    parser.add_argument('--input', '-i', help='Directory containing quiz result JSON files')
    parser.add_argument('--output', '-o', help='Directory for output CSV files')
    parser.add_argument('--files', '-f', nargs='+', help='Specific JSON files to process')
    
    args = parser.parse_args()
    
    if args.gui or not (args.input or args.files):
        run_gui()
    elif args.files:
        process_files(args.files, args.output)
    elif args.input:
        process_directory(args.input, args.output)
