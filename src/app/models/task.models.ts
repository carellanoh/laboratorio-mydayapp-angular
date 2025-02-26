/* Interfaz de una tarea (objeto) */

export interface Task{
    id: number;
    title: string;
    completed: boolean;
    editing?: boolean;
}