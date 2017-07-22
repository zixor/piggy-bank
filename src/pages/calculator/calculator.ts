import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class Calculator {

  private expression: string = "";
  private operators = ['+', '-', '*', '/'];
  private decimalAdded = false;

  constructor(
    private viewCtl: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Calculator');
  }

  add(input: string) {

    if (this.operators.indexOf(input) > -1) {
      // Operator is clicked
      // Get the last character from the equation
      var lastChar = this.expression[this.expression.length - 1];

      // Only add operator if input is not empty and there is no operator at the last
      if (this.expression != '' && this.operators.indexOf(lastChar) == -1) {
        this.expression += input;
      }

      // Allow minus if the string is empty
      else if (this.expression == '' && input == '-') {
        this.expression += input;
      }

      // Replace the last operator (if exists) with the newly pressed operator
      if (this.operators.indexOf(lastChar) > -1 && this.expression.length > 1) {
        // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
        this.expression = this.expression.replace(/.$/, input);
      }

      this.decimalAdded = false;
    } else if (input == ".") {

      if (!this.decimalAdded) {
        this.expression += input;
      }

    } else {
      this.expression += input;
    }

  }


  calculate() {

    var equation = this.expression;
    var lastChar = equation[equation.length - 1];

    // Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
    equation = equation.replace(/x/g, '*').replace(/÷/g, '/');

    // Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
    if (this.operators.indexOf(lastChar) > -1 || lastChar == '.')
      equation = equation.replace(/.$/, '');

    if (equation) {
      this.expression = eval(equation);
    }
    this.decimalAdded = false;

  }

  clear() {
    this.expression = "";
    this.decimalAdded = false;
  }

  closeModal() {
    if (!this.expression) {
      this.expression = "0";
    }
    this.viewCtl.dismiss(this.expression);
  }

  delete(){
    this.expression = this.expression.substring(0,(this.expression.length - 1));
  }

}
