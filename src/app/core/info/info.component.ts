import { Component, Input } from '@angular/core'


@Component({
	selector: 'app-info',
	standalone: true,
	imports: [],
	templateUrl: './info.component.html',
	styleUrl: './info.component.scss',
})
export class InfoComponent {
	@Input() title = 'Section title'
	@Input() data = [
		{
			title: 'Card 1',
			text: 'This super amazing text every one loves that piece of shit',
			icon: 'icon',
		},
		{
			title: 'Card 2',
			text: 'More amazing content to blow your mind, hold tight!',
			icon: 'icon',
		},
		{
			title: 'Card 3',
			text: 'Another card to make you wonder how great this really is!',
			icon: 'icon',
		},
		{
			title: 'Card 4',
			text: 'Fourth card, because three is just not enough!',
			icon: 'icon',
		},
		{
			title: 'Card 5',
			text: 'Five is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic cardive is a magic number. Magic text on a magic card!',
			icon: 'icon',
		},
		{
			title: 'Card 6',
			text: 'Are you still reading? This text just keeps getting better!',
			icon: 'icon',
		},
		{
			title: 'Card 7',
			text: 'Lucky number seven! Feels like you hit the jackpot!',
			icon: 'icon',
		},
		{
			title: 'Card 8',
			text: 'Card number eight, keeping things rolling like a pro!',
			icon: 'icon',
		},
	]
}
