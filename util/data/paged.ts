export class Paged<T> {
  constructor(
    public Response: number,
    public totalResults: number,
    public Search: T[]
  ) {
  }
}
