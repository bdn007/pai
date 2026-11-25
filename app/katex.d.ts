declare module 'katex' {
  const katex: {
    render(
      expression: string,
      element: HTMLElement,
      options?: {
        displayMode?: boolean;
        output?: 'mathml';
        throwOnError?: boolean;
      },
    ): void;
  };

  export default katex;
}
