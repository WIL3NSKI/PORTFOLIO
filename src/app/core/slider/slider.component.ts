import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { register } from 'swiper/element/bundle'
import { Swiper } from 'swiper/types'


@Component({
	selector: 'app-slider',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: `./slider.component.html`,
	styleUrl: './slider.component.scss',
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate(500, style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate(500, style({ opacity: 0 }))
			])
		])
	]
})
export class SliderComponent {
	@ViewChild('swiper') swiper?: ElementRef
	loaded = false
	slides: any[] = []

	constructor(private changeDetectorRef: ChangeDetectorRef) {
		register()
	}

	ngOnInit() {
		this.initSlides()
		this.loaded = true
		this.changeDetectorRef.detectChanges()
		const swiper: Swiper = this.swiper?.nativeElement.swiper
 		if ('init' in swiper) swiper.init()
	}

	initSlides() {
		for (let i = 0; i < 10; i++) {
			this.slides.push({
				text: `Slajd ${ i + 1 }`,
				bgColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
			})
		}
	}
}
