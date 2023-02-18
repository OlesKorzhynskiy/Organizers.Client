import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private readonly unsubscribe: Subject<void> = new Subject();

    constructor(private notificationService: NotificationService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe((params: any) => {
            let title = params['title'];
            let description = params['description'];

            if (!title && !description)
                return;

            if (description)
                this.notificationService.error(title, description);
            else
                this.notificationService.success(title);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
