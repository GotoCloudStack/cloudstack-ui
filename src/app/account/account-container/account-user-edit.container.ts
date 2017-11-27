import { Component, Inject } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { Account } from '../../shared/models/account.model';
import { AccountUser } from '../../shared/models/account-user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

@Component({
  selector: 'cs-account-user-edit-container',
  template: `
    <cs-account-user-edit
      [title]="title"
      [confirmButtonText]="confirmButtonText"

      [username]="username"
      [firstName]="firstName"
      [lastName]="lastName"
      [email]="email"

      (updateUser)="updateUser($event)"
    ></cs-account-user-edit>`
})
export class AccountUserEditContainerComponent {
  public account: Account;
  public user: AccountUser;

  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public timezone: string;

  public title: string;
  public confirmButtonText: string;

  constructor(
    private dialogRef: MatDialogRef<AccountUserEditContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store<State>
  ) {
    this.title = data.title;
    this.user = new AccountUser(data.user);

    if (this.user) {
      this.username = this.user.username;
      this.firstName = this.user.firstname;
      this.lastName = this.user.lastname;
      this.email = this.user.email;
      this.timezone = this.user.timezone;
    }

    this.account = data.account;
    this.confirmButtonText = data.confirmButtonText;
  }

  public updateUser(user: AccountUser) {
    if (!this.user) {
      user.account = this.account && this.account.name || user.username;

      if (this.account) {
        user.domainid = this.account.domainid;
      }

      this.store.dispatch(new accountActions.AccountUserCreate(user));
    } else {
      this.user.username = user.username;
      this.user.firstname = user.firstname;
      this.user.lastname = user.lastname;
      this.user.email = user.email;
      this.store.dispatch(new accountActions.AccountUserUpdate(this.user));
    }

    this.dialogRef.close();
  }
}
