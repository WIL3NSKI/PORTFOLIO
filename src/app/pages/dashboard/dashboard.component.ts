import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BannerComponent } from '../../core/banner/banner.component'

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
	    BannerComponent,
     ],
	templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent { }
