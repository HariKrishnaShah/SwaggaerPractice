// RandomController.ts
import { Controller, Get, Route } from '@tsoa/runtime';

interface Details {
  id: number;
  name: string;
}

@Route('random')
export class RandomController extends Controller {
  /**
   * @summary Get Sample output
   */
  @Get('/')
  public async getUsers(): Promise<Details[]> {
    // Logic to fetch users from database or elsewhere
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
  }
}