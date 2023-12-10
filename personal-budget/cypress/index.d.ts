declare namespace Cypress {
  interface Chainable {
    matchImageSnapshot: (name?: string, options?: Partial<any>) => void;
  }
}
