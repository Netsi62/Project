import { Component, OnInit } from '@angular/core';
import { CourseService } from '../Students/course/course.service';
import { Courses } from '../model/courses';
import { Grade } from '../model/grade';
import { GradeServiceService } from '../grades-table/grade-service.service';
import { AttendanceService } from '../attendance-table/attendance.service';
import { AuthService } from '../shared/auth.service';
import { User } from '../model/User';
import { Attendance } from '../model/attendance';
import { Register } from '../model/register';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.css']
})
export class TranscriptComponent implements OnInit {

  currentUser: User | null = null;
  studentGrades: Grade[] = [];
  studentAttendance: Attendance[] = [];
  courses: Courses[] = [];
  registerUser: Register | null = null;
  loading = false;
  error: string | null = null;
  semesterNames: string[] = [];
  YearNumbers: number[] = [];

  selectedSemester: string | null = null;
  averageTotal: number | null = null; 

  constructor(
    private authService: AuthService,
    private gradeService: GradeServiceService,
    private attendanceService: AttendanceService,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user && user.email) {
        this.fetchStudentGrades(user.email);
        this.fetchStudentAttendance(user.email);
        this.fetchCourses();
        this.fetchUserRegistration(user.email);
      }
    });
  }

  fetchCourses() {
    this.courseService.getAllCourses().subscribe(
      (courses: Courses[]) => {
        this.courses = courses;
        this.semesterNames = Array.from(new Set(courses.map(course => course.semesterName)));
        
       
        this.YearNumbers = Array.from(new Set(courses
          .map(course => course.selectedSemesterYear) 
          .filter(year => typeof year === 'number') 
          .map(year => year as number) // Cast to number
        ));
      },
      error => {
        this.error = 'Error retrieving courses.';
        console.error('Error retrieving courses:', error);
      }
    );
  }
  getYearForSemester(semesterName: string): number {
    const index = this.semesterNames.indexOf(semesterName);
    if (index !== -1) {
      return this.YearNumbers[index];
    }
    return -1; 
  }
  
  
  
  
  
  

  filterGradesBySemester(semesterName: string): Grade[] {
    const similarSemesters = this.semesterNames.filter(name => name.includes(semesterName));
  
    const courseIdsWithSemester = this.courses
      .filter(course => similarSemesters.some(similar => course.semesterName.includes(similar)))
      .map(course => course.id);
  
    return this.studentGrades.filter(grade => courseIdsWithSemester.includes(grade.courseId));
  }
  

  fetchStudentGrades(email: string) {
    this.loading = true;
    this.error = null;
  
    this.gradeService.getGradesByEmail(email).subscribe(
      grades => {
        this.studentGrades = grades;
        this.loading = false;
         // Calculate average total after fetching grades
        // Filter semester names based on the courses associated with the displayed grades
        this.semesterNames = Array.from(new Set(this.courses
          .filter(course => this.studentGrades.some(grade => grade.courseId === course.id))
          .map(course => course.semesterName)));
      },
      error => {
        this.error = 'Error fetching student grades.';
        this.loading = false;
        console.error(error);
      }
    );
  }
  

  fetchStudentAttendance(email: string) {
    this.loading = true;
    this.error = null;

    this.attendanceService.getAttendanceByEmail(email).subscribe(
      attendance => {
        this.studentAttendance = attendance;
        this.loading = false;
      },
      error => {
        this.error = 'Error fetching student attendance.';
        this.loading = false;
        console.error(error);
      }
    );
  }

 
  

  fetchUserRegistration(email: string) {
    this.authService.getUserRegistrationByEmail(email).subscribe(
      register => {
        if (register) {
          this.registerUser = register;
        } else {
          this.registerUser = null; // Assign null when register is undefined
        }
      },
      error => {
        this.error = 'Error fetching user registration details.';
        console.error('Error fetching user registration details:', error);
      }
    );
  }
  

  

  getCourseName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.course_name : 'Course Name Not Found';
  }

  getSemesterName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.semesterName : 'Semester Name Not Found';
  }
  
  
  

  calculateTotal(student: Grade): number {
    return +(student.quiz) + +(student.Assignment) + +(student.Exam);
  }

  calculateAverageTotal(semesterName: string): number {
    const filteredGrades = this.filterGradesBySemester(semesterName);
    const totalSum = filteredGrades.reduce((sum, grade) => sum + this.calculateTotal(grade), 0);
    const averageTotal = filteredGrades.length > 0 ? totalSum / filteredGrades.length : 0;
    return averageTotal;
  }
  
  getGPAForSemester(semesterName: string): Number {
    const averageTotal = this.calculateAverageTotal(semesterName);
    return this.getGPA(averageTotal);
  }
  

 

  getGrade(student: Grade): string {
    const total = this.calculateTotal(student);

    if (total >= 90) {
      return 'A';
    } else if (total >= 75 && total < 90) {
      return 'B';
    } else if (total >= 60 && total < 75) {
      return 'C';
    } else if (total >= 45 && total < 60) {
      return 'D';
    } else {
      return 'F';
    }
  }

  getGPA(averageTotal: number): Number {
    if (averageTotal >= 90) {
      return 4.0;
    } else if (averageTotal >= 75 && averageTotal < 90) {
      return 3.75;
    } else if (averageTotal >= 60 && averageTotal < 75) {
      return 2.50;
    } else if (averageTotal >= 45 && averageTotal < 60) {
      return 1.25;
    } else {
      return 0;
    }
  }
}
