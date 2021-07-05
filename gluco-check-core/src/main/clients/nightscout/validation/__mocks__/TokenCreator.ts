const mockFn = jest.fn();
export default class TokenCreator {
  constructor(private token: string, private url: string) {}
  public create = mockFn;
}
