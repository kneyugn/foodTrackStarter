import {Component} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { TextView } from "ui/text-view";
import { isAndroid } from "platform";
import {FirebaseUserService} from "../services/firebaseUser.service";

@Component({
    selector: "bp-form",
    moduleId: module.id,
    templateUrl: "./bpForm.component.html",
    styleUrls: ['./css/bpForm.css']
})
export class BPFormComponent {
    private usr_pic = '~/res/profilepic.jpg';
    private systolic = null;
    private diastolic = null;
    private message = null;

    private userInfo = {
        age: 29,
        name: "Jane Doe",
        username: "JDHealthy"
    };

    private bpValues = [];

    constructor(private fbUser: FirebaseUserService) {
        this.fbUser.user$.subscribe((userObj) => {
            if (userObj.bp_values) {
                this.bpValues = userObj.bp_values;
            }

        });
    }

    saveSystolic(args) {
        let textview: TextView = <TextView>args.object;
        this.systolic = textview.text;
        if (isAndroid) {
            textview.android.clearFocus();
        }
        this.message = null;
    }

    saveDiastolic(args) {
        let textview: TextView = <TextView>args.object;
        this.diastolic = textview.text;
        if (isAndroid) {
            textview.android.clearFocus();
        }
        this.message = null;
    }

    saveBP() {
        if (this.diastolic == null || this.systolic === null) {
            this.message = "Please enter both diastolic and systolic numbers.";
            return;
        }
        var timestamp = new Date(Date.now());
        var result = (timestamp.getMonth() + 1) + '/' + timestamp.getDate() + '/' + timestamp.getFullYear() +
            " " + timestamp.getHours() + ":" + timestamp.getMinutes();

        this.bpValues.push([this.systolic, this.diastolic, result]);
        this.fbUser.update_user({bp_values: this.bpValues});
    }


}