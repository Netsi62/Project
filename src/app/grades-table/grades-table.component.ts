import { Component, OnInit } from '@angular/core';
import { Grade } from '../model/grade';
import { GradeServiceService } from './grade-service.service';
import { ActivatedRoute } from '@angular/router';
import { Courses } from '../model/courses';
import { CourseService } from '../Students/course/course.service';

@Component({
  selector: 'app-grades-table',
  templateUrl: './grades-table.component.html',
  styleUrls: ['./grades-table.component.css']
})
export class GradesTableComponent implements OnInit {
  studentArray: Grade[] = [];
  courseId: string = '';
  email: string = '';
  quiz: number = 0;
  assignment: number = 0;
  exam: number = 0;
  courseName = '';
  semesterName = ''

  newGrade: Grade = {
    id: '',
    email: '',
    quiz: 0,
    Assignment: 0,
    Exam: 0,
    courseId: '',
    editMode: false,
    courseName: '',
    semesterName : ''
  };
  courses: Courses[] = []; 

  constructor(
    private gradeService: GradeServiceService, 
    private courseService: CourseService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe(
      (courses: Courses[]) => {
        this.courses = courses;
      },
      error => {
        console.error('Error retrieving courses:', error);
        // Handle error accordingly, e.g., set error message
      }
    );

    this.route.params.subscribe(params => {
      this.courseId = params['id'];
      if (this.courseId) {
        this.getAllGradesForCourse();
        const course = this.courses.find(c => c.id === this.courseId);
        if (course) {
          this.courseName = course.course_name;
        }
      }
    });
  }

  getAllGradesForCourse(): void {
    this.gradeService.getGradesByCourseId(this.courseId).subscribe(
      (res: Grade[]) => {
        this.studentArray = res;
      },
      error => {
        console.error('Error retrieving grades:', error);
        // Handle error accordingly, e.g., set error message
      }
    );
  }
  getCourseName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.course_name : '';
  }
  getSemesterName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.semesterName : '';
  }

  resetForm() {
    this.email = '';
    this.quiz = 0;
    this.assignment = 0;
    this.exam = 0;
    this.courseName = '';
    this.newGrade = { id: '', email: '', quiz: 0, Assignment: 0, Exam: 0, courseId: this.courseId, editMode: false, courseName: this.courseName, semesterName: this.semesterName };
  }

  addGrade(): void {
    const newGrade: Grade = {
      id: '', 
      email: this.email,
      quiz: this.quiz,
      Assignment: this.assignment,
      Exam: this.exam,
      editMode: false,
      courseId: this.courseId,
      courseName: this.courseName,
      semesterName: this.semesterName

    };

    this.gradeService.addGrade(newGrade).then(() => {
      console.log('Grade added successfully');
      this.getAllGradesForCourse();
      this.resetForm();
    }).catch(error => {
      console.error('Error adding grade:', error);
      
    });
  }

  deleteGrade(grade: Grade): void {
    if (window.confirm('Are you sure you want to delete ' + grade.email + '?')) {
      this.gradeService.deleteGrade(grade.id).then(() => {
        console.log('Grade deleted successfully');
        this.studentArray = this.studentArray.filter(g => g.id !== grade.id);
        // Update data after deleting the grade
      }).catch(error => {
        console.error('Error deleting grade:', error);
        // Handle error
      });
    }
  }

  onTotal(grade: Grade): string {
    const total = grade.quiz + grade.Assignment + grade.Exam;

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
    return +student.quiz + +student.Assignment + +student.Exam;
  }
}
