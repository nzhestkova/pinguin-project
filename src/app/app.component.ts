import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { User } from "./model/user";
import { CookiesService } from "./services/cookies-service/cookies.service";
import { UserService } from "./services/user-service/user.service";
import { ThemeStoreService } from "./store/services/theme-store.service/theme-store.service";
import { UserStoreService } from "./store/services/user-store.service/user-store.service";
import { WaitingStoreService } from "./store/services/waiting-store.service/waiting-store.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, DoCheck {
  constructor(private userStore: UserStoreService,
              private userService: UserService,
              private cookieService: CookiesService,
              private themeStore: ThemeStoreService,
              private waitingStore: WaitingStoreService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
  }

  specialSign: string = environment.versionSign;
  user: User | {};
  showSign: boolean;
  darkThemeEnable: boolean;
  loading: Observable<boolean>;

  logout(): void {
    this.cookieService.deleteCookies();
    this.userStore.logout();
    this.cdr.markForCheck();
  }

  toggleTheme(): void {
    this.themeStore.toggleTheme();
  }

  ngOnInit(): void {
    this.loading = this.waitingStore.loadInfo();
    const savedLogin = this.cookieService.checkUser();
    const savedPassword = this.cookieService.checkPassword();
    if (savedLogin && savedPassword) {
      this.waitingStore.activateLoading();
      this.userService.loginUser(savedLogin, savedPassword).subscribe(
        data => {
          this.userStore.loginUser(data);
          this.waitingStore.deactivateLoading();
        },
        () => {
          this.cookieService.deleteCookies();
          this.waitingStore.deactivateLoading();
        },
      );
    }
    // const currentHour = new Date().getHours();
    // if ((currentHour >= 21 && currentHour < 24) || (0 <= currentHour && currentHour <= 7)) {
    //   this.themeStore.toggleTheme();
    // }
  }

  ngDoCheck(): void {
    this.themeStore.loadThemeInfo().subscribe(mode => this.darkThemeEnable = mode);

    this.userStore.loadUserInfo().subscribe(
      user => {
        this.user = user;
        this.showSign = !Object.keys(user).length;
        this.cdr.markForCheck();
      },
    );
  }
}
