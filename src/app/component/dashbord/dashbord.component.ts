import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Courses } from 'src/app/model/courses';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { SemesterService } from '../semester/semester.service';
import { Semester } from 'src/app/model/semester';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {

  // Declare necessary properties
  coursesList: Courses[] = [];
  isEditing: boolean = false;
  editingCourseId: string | null = null;
  selectedsemesterId: string = '';
  selectedsemesterName: string = '';
  semesterList: Semester[] = [];
  semesterNames: string[] = [];
  course_name: string = ''; 
  description: string = ''; 
  selectedSemesterYear: number = 2020;
  @Output() selectedSemesterYearChange = new EventEmitter<number>();

  courseObj: Courses = {
    id: '',
    course_name: '',
    description: '',
    editMode: false,
    semester: '',
    semesterId: '',
    semesterName : '',
    selectedsemesterName : '',
    Year : 2020,
    selectedSemesterYear : 2023
  
  };

  constructor(private auth: AuthService, private data: DataService, private semesterService: SemesterService) { }

  ngOnInit(): void {
    this.getAllCourses();
    this.fetchSemesters();
  }

  
  


  // In your component class




  fetchSemesters() {
    // Fetch semesters from the service
    this.semesterService.getSemester().subscribe(
      (res: any[]) => {
        // Map fetched semesters and assign them to semesterList
        this.semesterList = res.map((e) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
        // Extract semester names from semesterList
        this.semesterNames = this.semesterList.map(semester => semester.semesterName);
      },
      (err) => {
        console.error('Error retrieving semesters:', err);
        alert('Something went wrong while retrieving semesters.');
      }
    );
  }

  logout() {
    // Log out the user
    this.auth.logout();
  }

  updateCourseInRow(course: Courses): void {
    // Update course details
    if (!course.course_name.trim() || !course.description.trim()) {
      alert('Please fill all fields');
      return;
    }

    this.data.updateCourse(course).then(() => {
      console.log('Course updated successfully');
      this.isEditing = false;
      this.editingCourseId = null;
    }).catch((error) => {
      console.error('Error updating course:', error);
      alert('Something went wrong while updating the course.');
    });
  }

  toggleEditing(course: Courses) {
    // Toggle editing mode for the specific course
    course.editMode = !course.editMode;
  }
  

  getAllCourses() {
    // Fetch all courses
    this.data.getAllCourses().subscribe(
      (res: any[]) => {
        // Map fetched courses and assign them to coursesList
        this.coursesList = res.map((e) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        console.error('Error retrieving courses:', err);
        alert('Something went wrong while retrieving courses.');
      }
    );
  }

  resetForm() {
    // Reset form fields
    this.course_name = '';
    this.description = '';
  }

  

  addCourse() {
    console.log(this.courseObj);
    console.log('Course Name:', this.courseObj.course_name);
    console.log('Description:', this.courseObj.description);
    console.log('Semester Name:', this.courseObj.semesterName); // Corrected property name
    
    if (!this.courseObj.course_name.trim() || !this.courseObj.description.trim() || !this.courseObj.semesterName) {
      alert('Please fill all the fields');
      return;
    }
  
    
    const selectedSemesterId = this.getSemesterId(this.courseObj.semesterName);
  
    
    this.courseObj.semesterId = selectedSemesterId;
    this.courseObj.selectedsemesterName = this.courseObj.semesterName;
    
  
    
    this.data.addCourse(this.courseObj).then(() => {
      console.log('Course added successfully');
      
      // Update selected semester year for the newly added course
      this.selectedSemesterYear = this.getSemesterYear(selectedSemesterId);
      
     
    }).catch((error) => {
      console.error('Error adding course:', error);
      alert('Something went wrong while adding the course.');
    });
  }
  
  


  deleteCourse(course: Courses) {
    // Delete a course
    if (window.confirm('Are you sure you want to delete ' + course.course_name + '?')) {
      this.data.deleteCourses(course);
    }
  }

  updateSelectedSemesterName() {
    const selectedSemester = this.semesterList.find(semester => semester.id === this.selectedsemesterId);
    this.selectedsemesterName = selectedSemester ? selectedSemester.semesterName : 'Not Found';
    this.courseObj.semesterName = this.selectedsemesterName;
    this.selectedSemesterYear = selectedSemester ? selectedSemester.Year as number : new Date().getFullYear();

    // Emit the updated selectedSemesterYear
    this.selectedSemesterYearChange.emit(this.selectedSemesterYear); // Emitting a number
  }


  
  
  
  
  
  // Function to get the ID of the selected semester based on its name
  getSemesterId(semesterName: string): string {
    const selectedSemester = this.semesterList.find(semester => semester.semesterName === semesterName);
    return selectedSemester ? selectedSemester.id : 'not get';
  }
  getSemesterYear(semesterId: string): number {
    const selectedSemester = this.semesterList.find(semester => semester.id === semesterId);
    return selectedSemester ? selectedSemester.Year as number : new Date().getFullYear();
}

}
