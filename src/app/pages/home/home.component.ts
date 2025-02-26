/* 
Prueba Técnica 1: Desarrollo Frontend con Angular todoApp PLATZI
https://github.com/platzi/laboratorio-mydayapp-angular

El proyecto estaba en angular 15 y lo migre a angular 16, me imagino por eso las pruebas salieron mal las 20
ng update @angular/core@16 @angular/cli@16 --force
*/

import { Component, OnInit, signal, computed, effect, inject, Injector } from '@angular/core';
import { Task } from '../../models/task.models';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'> ('all');
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if(filter === 'pending'){
      return tasks.filter((task) => !task.completed);
    }
    if(filter === 'completed'){
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  })

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });

  injector = inject(Injector);

  constructor() {
    effect(() => {
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    });
   } 

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
  }


  changeHandler(){
    if(this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value.trim();
      if(value !== ''){
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addTask(title:string){
    const newTask ={
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index:number){
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index))
 }

 /* Clase 13, update task completed */

 updateTask(index: number) {
   this.tasks.update((tasks) => {
     return tasks.map((task, position) => {
       if (position === index) {
         return {
           ...task,
           completed: !task.completed
         }
       }
       return task;
     })
   })
 }


 /* Clase 20 Editar texto de tarea */

 updateTaskEditingMode(index: number) {
   this.tasks.update((prevState) => {
     return prevState.map((task, position) => {
       if (position === index) {
         return {
           ...task,
           editing: true
         }
       }
       return {
         ...task,
         editing: false
       };
     })
   });
 }


 updateTaskText(index: number, event: Event) {
   const input = event.target as HTMLInputElement;
   this.tasks.update((prevState) => {
     return prevState.map((task, position) => {
       if (position === index) {
         return {
           ...task,
           title: input.value,
           editing: false
         }
       }
       return task;
     })
   });
 }


 /* Clase 21 Computed States */
 changeFilter(filter: 'all' | 'pending' | 'completed') {
   this.filter.set(filter);
 }


}
