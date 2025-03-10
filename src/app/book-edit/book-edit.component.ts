import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Book} from "../models/book";
import {ActivatedRoute, Router} from "@angular/router";
import {BookService} from "../services/book.service";
import {DialogFailComponent} from "../dialog-fail/dialog-fail.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  loading = true;
  @Input()
  book!: Book
  bookForm: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private bookService: BookService,
              public dialog: MatDialog,) {
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(paraMap => {
      const id = paraMap.get('id')
      console.log(id);
      // @ts-ignore
      this.bookService.getById(id).subscribe(result => {
        this.bookForm = new FormGroup({
          id: new FormControl(result.id),
          title: new FormControl(result.title),
          author: new FormControl(result.author),
          description: new FormControl(result.description),
        });
        console.log(result)
      }, error => {
        console.log(error);
      })
    })
  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }

  openDialog2() {
    this.dialog.open(DialogFailComponent);
    this.closeAllDialog()
  }
  closeAllDialog() {
    setTimeout(() => {
      this.dialog.closeAll()
    }, 7000)
  }
  change() {
    this.loading = false;
  }

  updateBook() {
    let book = {
      name: this.bookForm.value.name,
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      description: this.bookForm.value.description,
    }
    console.log(book);
    // @ts-ignore
    this.bookService.update(this.bookForm.value.id, book).subscribe(() => {
      this.router.navigate(["/list"]).then(success => {
        console.log('đường dẫn đúng', success)
        this.openDialog2()
      }, error => {
        console.log('đường dẫn sai', error)
      });
      this.openDialog()
      this.bookService.notify1()
      this.bookService.notify2()
    })
  }

  deleteBook1(id: any) {
    this.bookService.delete(id).subscribe(() => {
      this.router.navigate(["/list"]).then(r => {
        console.log('đường dẫn đúng', r);
      });
      // @ts-ignore
      this.bookService.notify2(this.bookService.notify3(this.bookService.notify1()))
    }, error => {
      console.log("Lỗi", error)
    })
  }
}
