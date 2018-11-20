import { Component } from '@angular/core';
import { GodfathersPage } from '../godfathers/list/godfathers-list';
import { GodsonsPage } from '../godsons/list/godsons-list';
import { NewsListPage } from "../../news/list/news-list";
import { New } from "../../../models/new";

@Component({
  templateUrl: 'admin-tabs.html'
})
export class AdminTabsPage {
  tab1Root = NewsListPage;
  tab2Root = GodfathersPage;
  tab3Root = GodsonsPage;

  constructor() {}
}
