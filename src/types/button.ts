/**
 * UI Button interface
 */
export default interface Button {
  /**
   * Button label
   */
  label: string;
  /**
   * Button style
   */
  style: string;
  /**
   * Function which execute when user click on button
   */
  onClick: () => void;
};
