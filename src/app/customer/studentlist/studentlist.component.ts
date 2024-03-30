import { Component, OnInit } from '@angular/core';
import { Courses } from 'src/app/model/courses';
import { Router } from '@angular/router';
import { StudentlistService } from './studentlist.service';

@Component({
  selector: 'app-studentlist',
  templateUrl: './studentlist.component.html',
  styleUrls: ['./studentlist.component.css']
})
export class StudentlistComponent implements OnInit {

  courses: Courses[] = [];
  loading: boolean = true; 

  constructor(private studentlistService: StudentlistService, private router: Router) { }

  ngOnInit(): void {
    this.studentlistService.getAllCourses().subscribe(
      (courses: Courses[]) => {
        this.courses = courses;
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching courses:', error);
        this.loading = false; 
      }
    );
  }

  navigateToGrade(courseId: string) {
    this.router.navigate(['/studentCourse', courseId]); 
  }
}
