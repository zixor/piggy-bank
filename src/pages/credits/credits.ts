import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UtilitiesService } from '../../providers/utilities.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class Credits {

  @ViewChild('doughnut') doughnutCanvas;

  doughnutChart: any;

  constructor(private iab: InAppBrowser,
    private utilitiesService: UtilitiesService) {
    this.initializeConstants();
  }

  private EMAIL_ME_TITLE: string = "";
  private EMAIL_ME_BODY: string = "";

  initializeConstants() {
    this.utilitiesService.getValueByLanguaje("EMAIL_ME_TITLE").then(value => {
      this.EMAIL_ME_TITLE = value;
    });
    this.utilitiesService.getValueByLanguaje("EMAIL_ME_BODY").then(value => {
      this.EMAIL_ME_BODY = value;
    });
  }

  initializeData() {

    this.makeGraphics();

  }

  ionViewDidLoad() {

    this.initializeData();

  }

  private makeGraphics() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: ["Java", "JavaScript", "PHP", "SQL and Plsql", "Hybrid Mobile Applications",
          "Scrum Master Certified", "Scrum Developer Certified", "Intermediate English"],
        datasets: [{
          label: '# of Votes',
          data: [90, 83, 80, 80, 70, 100, 100, 65],
          backgroundColor: [
            "#36b9d5", "#28cab2", "#3ccc86", "#a9cc3e",
            "#fdbd3f", "#41535f", "#e35144", "#7e29ba"

          ],
          hoverBackgroundColor: [
            "#36b9d5", "#28cab2", "#3ccc86", "#a9cc3e",
            "#fdbd3f", "#41535f", "#e35144", "#7e29ba"
          ]
        }]
      }

    });

  }

  showItem() {
    console.log("show in cloud");
  }

  openLinkedIn() {
    this.iab.create("https://www.linkedin.com/in/noel-gonzalez-5a169b29/", "_self", "location=yes");
  }

  openTwitter() {
    this.iab.create("http://twitter.com/Noel_Gonzalez_H", "_self", "location=yes");
  }

  emailMe() {

    this.utilitiesService.sendEmail("noel.gonzalez.h@gmail.com", this.EMAIL_ME_TITLE,
      this.EMAIL_ME_BODY, "");

  }


}
