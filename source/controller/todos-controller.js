export class Tests {
  async test(req, res){
    res.json({test: "test"});
  }
}

export const testsController = new Tests();