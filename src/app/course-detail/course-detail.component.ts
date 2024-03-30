// course-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from './coursedetail.service';
import { Courses } from '../model/courses';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseObj: Courses = {
    id: '',
    course_name: '',
    description: '',
    editMode: false,
    semester : '',
    semesterId : '',
    semesterName : '',
    selectedsemesterName : '',
    Year : 2020,
    selectedSemesterYear : 2022
  };

  constructor(private route: ActivatedRoute, private courseService: CourseService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.courseService.getCourseById(id).subscribe((course: Courses) => {
        this.courseObj = course;
      });
    });
  }
}
