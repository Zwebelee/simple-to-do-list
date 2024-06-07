export default class Todo {
  constructor(
    id,
    title,
    description,
    createdAt,
    dueDate,
    updatedAt,
    importance,
    finished,
    guid
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.dueDate = dueDate;
    this.importance = importance;
    this.finished = finished;
    this.guid = guid;
  }
}
