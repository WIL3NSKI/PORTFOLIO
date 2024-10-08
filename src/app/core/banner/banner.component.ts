import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component'

@Component({
    selector: 'app-banner',
    standalone: true,
    imports: [
        CommonModule,
	    ButtonComponent
    ],
    templateUrl: `./banner.component.html`,
    styleUrl: './banner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent { }
