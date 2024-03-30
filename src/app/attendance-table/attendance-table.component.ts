import { Component, OnInit } from '@angular/core';
import { Grade } from '../model/grade';
import { GradeServiceService } from '../grades-table/grade-service.service';
import { Attendance } from '../model/attendance';
import { AttendanceService } from './attendance.service';
import { Courses } from '../model/courses';
import { CourseService } from '../Students/course/course.service';

@Component({
  selector: 'app-attendance-table',
  templateUrl: './attendance-table.component.html',
  styleUrls: ['./attendance-table.component.css']
})
export class AttendanceTableComponent implements OnInit {
  daysArray: number[] = Array.from({ length: 30 }, (_, index) => index + 1);
  studentArray: Grade[] = [];
  studentAttendance: Attendance[] = [];
  selectedEmail: string = ''; 
  selectedDate: string = '';
  instructorName: string = ''; 
  courseName : string = ''
  checkbox1Checked: boolean = false;
  checkbox2Checked: boolean = false;
  selectedCourseId: string = ''; 
  courses: Courses[] = [];
  selectedCourseName: string = '';
  editedCourseName: string = ''

  constructor(private gradeService: GradeServiceService, private attendanceService: AttendanceService, private courseService: CourseService) { }

  ngOnInit(): void {
    this.fetchStudentAttendance();
    this.fetchCourses();
    this.getAllAttendance()
  }

  fetchStudentAttendance(): void {
    if (!this.selectedEmail || !this.selectedCourseId) {
      console.error('Selected email or course ID is empty');
      return;
    }
  
    this.attendanceService.getAttendanceByCourseIdAndEmail(this.selectedCourseId, this.selectedEmail).subscribe(
      attendance => {
        this.studentAttendance = attendance || [];
      },
      error => {
        console.error('Error fetching student attendance:', error);
      }
    );
  
    
    const selectedCourse = this.courses.find(course => course.id === this.selectedCourseId);
    this.selectedCourseName = selectedCourse ? selectedCourse.course_name : '';
  }

  fetchCourses(): void {
    this.courseService.getAllCourses().subscribe(
      courses => {
        this.courses = courses;
      },
      error => {
        console.error('Error fetching courses:', error);
      }
    );
  }
  getAllAttendance(): void {
    this.attendanceService.getAllAttendance().subscribe(
      attendance => {
        this.studentAttendance = attendance || [];
      },
      error => {
        console.error('Error fetching all attendance:', error);
      }
    );
  }

  saveData(): void {
    if (this.selectedEmail && this.selectedDate && this.instructorName && this.selectedCourseId) {
      const status = this.checkbox1Checked ? 'Absent' : 'Present';
  
      const newAttendance: Attendance = {
        userId: this.selectedEmail,
        date: this.selectedDate,
        status: status,
        courseId: this.selectedCourseId,
        instructor: this.instructorName,
        courseName: this.selectedCourseName
      };
  
      this.attendanceService.addAttendance(newAttendance)
        .then(() => {
          console.log('Attendance added successfully!');
          alert('Attendance Added Successfully');
          // Add new attendance record to the existing array
          this.studentAttendance.push(newAttendance);
        })
        .catch(error => {
          console.error('Error adding attendance: ', error);
        });
    } else {
      console.error('Selected email, date, instructor name, or course is undefined or empty.');
    }
  }
  
  
  

  updateCheckboxes(checkboxNumber: number) {
   
    if (checkboxNumber === 1) {
      this.checkbox1Checked = true;
      this.checkbox2Checked = false;
    } else {
      this.checkbox1Checked = false;
      this.checkbox2Checked = true;
    }
  }

  updateSelectedCourseName(): void {
    const selectedCourse = this.courses.find(course => course.id === this.selectedCourseId);
    this.selectedCourseName = selectedCourse ? selectedCourse.course_name : '';
  }
  
}
