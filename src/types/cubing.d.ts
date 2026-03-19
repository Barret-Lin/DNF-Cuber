declare global {
  namespace JSX {
    interface IntrinsicElements {
      'twisty-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        puzzle?: string;
        alg?: string;
        'setup-alg'?: string;
        'control-panel'?: string;
        background?: string;
      }, HTMLElement>;
    }
  }
}

export {};
