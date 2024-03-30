import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Students } from 'src/app/model/student';
import { StudentService } from 'src/app/shared/student.service';
import { Courses } from 'src/app/model/courses';
import { CourseService } from '../course/course.service';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  studentList: Students[] = [];
  courseId: string = '';
  email: string = '';
  courseName = '';
  course_name = '';
  description = '';
  department: string = '';
  courseList: Courses[] = [];
  id: string = '';
  submittedEmail: string = '';
  submittedPassword: string = '';
  newStudent: Students = { id: '', email: '', department: '', courseId: '' , description: '', course_name: ''}; 

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

 ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.courseId = params['id'];
    if (this.courseId) {
      this.getAllCourses().subscribe(courses => {
        this.courseList = courses;
        const course = this.courseList.find(c => c.id === this.courseId);
        if (course) {
          this.courseName = course.course_name;
          this.getStudents();
        }
      });
    }
  });
}

  
  getCourseName(courseId: string): string {
    const course = this.courseList.find(c => c.id === courseId);
    return course ? course.course_name : '';
  }

  getStudents(): void {
    this.studentService.getStudentsByCourseId(this.courseId).subscribe(
      (students: Students[]) => {
        this.studentList = students;
      },
      (error) => {
        console.error('Error retrieving students:', error);
        // Handle error accordingly, e.g., set error message
        this.addError = 'Failed to retrieve students';
      }
    );
  }


 

  getAllCourses(): Observable<Courses[]> {
    return this.courseService.getAllCourses().pipe(
      catchError((err) => {
        console.error('Error retrieving courses:', err);
        alert('Something went wrong while retrieving courses.');
        return [];
      })
    );
  }

  getStudentsByCourseId(courseId: string): Observable<Students[]> {
    return this.studentService.getStudentsByCourseId(courseId).pipe(
      catchError((err) => {
        console.error('Error retrieving students:', err);
        alert('Something went wrong while retrieving students.');
        return [];
      })
    );
  }

  resetForm() {
    this.id = '';
    this.email = '';
    this.department = '';
    this.newStudent = { id: '', email: '', department: '', courseId: '', course_name: '', description: '' }; // Reset courseId as well
  }

  addError: string = '';

  addStudent(): void {
    const newStudent: Students = {
      id : this.id,
      email: this.email,
      department: this.department,
      courseId: this.courseId,
      course_name: this.course_name,
      description: this.description

    };

    this.studentService.addStudent(newStudent).then(() => {
      console.log('Student added successfully');
      // After adding the student, refresh the student list
      this.getStudents();
      // Clear input fields
      this.email = '';
      this.department = '';
    }).catch(error => {
      console.error('Error adding student:', error);
      // Handle error
      this.addError = 'Failed to add student';
    });
  }


  deleteStudent(student: Students): void {
    if (window.confirm('Are you sure you want to delete ' + student.email + '?')) {
      this.studentService.deleteStudent(student.id).then(() => {
        console.log('Student deleted successfully');
        this.studentList = this.studentList.filter(s => s.id !== student.id);
        // Update localStorage after deleting the student
        localStorage.setItem('studentList', JSON.stringify(this.studentList));
      }).catch(error => {
        console.error('Error deleting student:', error);
        alert('Something went wrong while deleting the student.');
      });
    }
  }

  getCourseDetails(courseId: string): void {
    this.studentService.getStudentsByCourseId(courseId).pipe(
      filter(students => !!students && students.length > 0), // Filter out undefined or empty student arrays
      map(students => students[0]) // Assuming there's only one student per course, select the first student
    ).subscribe(
      (student: Students) => {
        this.email = student.email;
        this.department = student.department;
      },
      error => {
        console.error('Error fetching student details:', error);
        // Handle error accordingly, for example, set default values for email and department
        this.email = '';
        this.department = '';
      }
    );
  }
}
