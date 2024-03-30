import { Component, OnInit, Input } from '@angular/core';
import { Courses } from 'src/app/model/courses';
import { CourseService } from './course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: Courses[] = [];
  loading: boolean = true;
  @Input() selectedSemesterYear: number | undefined;

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe(
      (courses: Courses[]) => {
        // Set the selected semester year for each course
        courses.forEach(course => {
          course.selectedSemesterYear = this.selectedSemesterYear || 0; // Initialize to a default value if undefined
        });
        
        this.courses = courses;
        console.log(this.courses);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching courses:', error);
        this.loading = false;
      }
    );
  }

  navigateToRegistration(courseId: string) {
    this.router.navigate(['/courseregistration', courseId]);
  }

  navigateToGrade(courseId: string) {
    this.router.navigate(['/grade', courseId]);
  }

  navigateToAttend(courseId: string) {
    this.router.navigate(['/attendance', courseId]);
  }

  
}
