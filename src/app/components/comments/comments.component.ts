import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/resources/models/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() comments : Comment[];

  comment = new FormControl('', Validators.required);

  constructor() { }

  ngOnInit() {}

  formatDate(date) {
    return formatDate(date, 'dd/MM/yyyy', 'en-US')
  }

  submit() {
    console.log(this.comment.value)
  }
}
