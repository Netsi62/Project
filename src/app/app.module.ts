import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire/compat'
import { enviroment } from 'src/enviroments/enviroment.prod';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashbordComponent } from './component/dashbord/dashbord.component';
import { FormsModule } from '@angular/forms';
import { CourseComponent } from './Students/course/course.component';
import { RegistrationComponent } from './Students/registration/registration.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { StudentCourseComponent } from './customer/student-course/student-course.component';
import { MenuComponent } from './menu/menu.component';
import { GradesTableComponent } from './grades-table/grades-table.component';
import { AttendanceTableComponent } from './attendance-table/attendance-table.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { FilterComponent } from './filter/filter.component';
import { StudentlistComponent } from './customer/studentlist/studentlist.component';
import { SemesterComponent } from './component/semester/semester.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { TranscriptComponent } from './transcript/transcript.component';
import { FilterBySemesterPipe } from './grades-table/filter-by-semester.pipe';
import { TestComponent } from './test/test.component';







@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashbordComponent,
    CourseComponent,
    RegistrationComponent,
    AdminComponent,
    UserComponent,
    StudentCourseComponent,
    MenuComponent,
    GradesTableComponent,
    AttendanceTableComponent,
    CourseDetailComponent,
    FilterComponent,
    StudentlistComponent,
    SemesterComponent,
    AdminUserComponent,
    TranscriptComponent,
    FilterBySemesterPipe,
    TestComponent

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(enviroment.firebase),
    FormsModule,
   
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
