import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {LoginComponent} from './component/login/login.component';
import {DashbordComponent} from './component/dashbord/dashbord.component';
import {RegisterComponent} from './component/register/register.component';
import { CourseComponent } from './Students/course/course.component';
import { RegistrationComponent } from './Students/registration/registration.component';
import { StudentCourseComponent } from './customer/student-course/student-course.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { GradesTableComponent } from './grades-table/grades-table.component';
import { AttendanceTableComponent } from './attendance-table/attendance-table.component';
import { SemesterComponent } from './component/semester/semester.component';
import { TranscriptComponent } from './transcript/transcript.component';
import { AdminUserComponent } from './admin-user/admin-user.component';




const routes: Routes = [

  {path : '', redirectTo:'login', pathMatch:'full' },
  {path:'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},


  {path: '', component:UserComponent, children:[
 
    {path:'studentCourse', component:StudentCourseComponent},
    {path: 'transcript', component: TranscriptComponent},
    
    

  ]},

  {path: '', component:AdminComponent, children:[
    {path: 'dashboard', component: DashbordComponent},
    {path : 'semester', component:SemesterComponent},
    {path: 'user', component:AdminUserComponent},
   
    {path:'course', component:CourseComponent},
    {path: 'courseregistration/:id', component:RegistrationComponent},
    { path: 'courseDetail/:id', component: CourseDetailComponent},
      {path:'attendance', component:AttendanceTableComponent},
      {path:'grade/:id', component:GradesTableComponent}
    ,
    



]},


  
 

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
