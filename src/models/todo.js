export class Todo {
  constructor(
    id,
    title,
    description,
    dueDate,
    importance,
    finished,
    createdAt = Date.now(),
    updatedAt = null,
    guid = crypto.randomUUID()
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.dueDate = dueDate;
    this.importance = importance;
    this.finished = finished;
    this.guid = guid
  }
}
