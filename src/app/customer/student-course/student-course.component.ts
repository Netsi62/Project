import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/model/User';
import { GradeServiceService } from 'src/app/grades-table/grade-service.service';
import { Grade } from 'src/app/model/grade';
import { AttendanceService } from 'src/app/attendance-table/attendance.service';
import { Attendance } from 'src/app/model/attendance';
import { Register } from 'src/app/model/register';
import { Courses } from 'src/app/model/courses';
import { CourseService } from 'src/app/Students/course/course.service';
import { StudentService } from 'src/app/shared/student.service';
import { Students } from 'src/app/model/student';

@Component({
  selector: 'app-student-course',
  templateUrl: './student-course.component.html',
  styleUrls: ['./student-course.component.css']
})
export class StudentCourseComponent implements OnInit {
  currentUser: User | null = null;
  studentGrades: Grade[] = [];
  studentAttendance: Attendance[] = [];
  courses: Courses[] = [];
  RegisterUser: Register | null = null;
  StudentUser : Students[] =[]
  loading = false;
  error: string | null = null;
  semesterNames: string[] = [];
  courseId : string = ''
  selectedSemester: string | null = null;
  

  constructor(
    private authService: AuthService,
    private gradeService: GradeServiceService,
    private attendanceService: AttendanceService,
    private courseService: CourseService,
    private StudentService : StudentService,
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user && user.email) {
        this.fetchStudentGrades(user.email);
        this.fetchStudentAttendance(user.email);
        this.fetchCourses();
        this.fetchUserRegistration(user.email);
        console.log('Student Grades:', this.studentGrades);


      }
      
    });
  }

  filterGradesBySemester(semesterName: string): Grade[] {
    return this.studentGrades.filter(grade => grade.semesterName === semesterName);
  }
  

  getSemesterNameForTranscript(courseId: string): string {
    const semesterName = this.getSemesterName(courseId);
    return semesterName !== 'Semester Name Not Found' 
      ? `Here is your Transcript for ${semesterName}` 
      : 'Semester Name Not Found';
  }


  fetchCourses() {
  this.courseService.getAllCourses().subscribe(
    (courses: Courses[]) => {
      this.courses = courses;

      // Populate semesterNames after fetching courses
      const uniqueSemesterNames = new Set<string>();
      this.courses.forEach(course => {
        if (course.semesterName) { // Check if semesterName is defined
          uniqueSemesterNames.add(course.semesterName);
        }
      });
      this.semesterNames = Array.from(uniqueSemesterNames);

      console.log('Semester Names:', this.semesterNames); // Add this line for debugging

    },
    error => {
      console.error('Error retrieving courses:', error);
    }
  );
}

  
  
  
  

  fetchStudentGrades(email: string) {
    this.loading = true;
    this.error = null;
  
    this.gradeService.getGradesByEmail(email).subscribe(
      grades => {
        console.log('Fetched student grades:', grades); 
        this.studentGrades = grades;
        this.loading = false;
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
    this.loading = true; 
    this.error = null; 
    this.StudentService.getUserRegistrationByEmail(email).subscribe(
      register => {
        console.log("Raw user registration response:", register);
        // Assuming you have a function to get course details by ID
        register.forEach(entry => {
          const course = this.courses.find(c => c.id === entry.courseId);
          if (course) {
            entry.course_name = course.course_name;
            entry.description = course.description;
          }
        });
        this.StudentUser = register;
        console.log("User registration details:", this.StudentUser);
        this.loading = false; // Update loading state after successful data fetch
      },
      error => {
        this.error = 'Failed to fetch user registration details. Please try refreshing the page.';
        this.loading = false; // Update loading state after error
        console.error('Error fetching user registration details:', error);
      }
    );
  }
  
  
  

  onTotal(student: Grade): string {
    const total = (student.quiz) + (student.Assignment) + (student.Exam);

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

  total(student: Grade): number {
    const total = +(student.quiz) + +(student.Assignment) + +(student.Exam);
    return total;
  }
  
  getCourseName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.course_name : 'Course Name Not Found';
  }

  getSemesterName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.semesterName : 'Semester Name Not Found';
  }

  getCourseNameForAttendance(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.course_name : 'Course Name Not Found';
  }
}