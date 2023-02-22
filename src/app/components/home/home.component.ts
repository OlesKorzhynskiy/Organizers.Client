import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SwiperOptions } from 'swiper';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private readonly unsubscribe: Subject<void> = new Subject();

    images: Array<string> = [
       "/assets/home-image.webp",
       "/assets/home-image.webp",
       "/assets/home-image.webp"
    ]
    config: SwiperOptions = {
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        spaceBetween: 30
    };

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
