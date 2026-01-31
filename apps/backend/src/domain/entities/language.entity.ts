export class Language {
  id: string;
  code: string;
  name: string;

  constructor(data: { id: string; code: string; name: string }) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
  }
}
