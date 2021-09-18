import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {

    form: FormGroup;
    loading = false;
    submitted = false;
    fileContent: string = '';
    count: number;
    fileName: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            file: ['',],
            fileName: ['',],
            fileContent: ['',],
            wordCount: ['',]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.form.invalid) {
            console.log("test")
            return;
        }
        console.log(this.form.value.file);
        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
    public onUpload(fileList: FileList): void {
        console.log(fileList[0]);
        let file = fileList[0];
        this.form.value.fileName = fileList[0].name;
        let fileReader: FileReader = new FileReader();
        let self = this;
        fileReader.onloadend = function(x) {
          self.form.value.fileContent = fileReader.result as string;
          self.fileContent =  self.form.value.fileContent.split('\n').join(' ');
          self.form.value.wordCount = self.fileContent.split(' ').length;
        }
        fileReader.readAsText(file);
      }
}
