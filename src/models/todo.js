export class Todo {
  constructor(
    id,
    title,
    description,
    dueDate,
    importance,
    finished
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = Date.now();
    this.updatedAt = null;
    this.dueDate = dueDate;
    this.importance = importance;
    this.finished = finished;
    this.guid = crypto.randomUUID();
  }
}
