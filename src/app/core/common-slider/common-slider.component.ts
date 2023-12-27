import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-common-slider',
    standalone: true,
    imports: [
        CommonModule,
    ],
	templateUrl: `./common-slider.component.html`,
    styleUrl: './common-slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonSliderComponent { }
