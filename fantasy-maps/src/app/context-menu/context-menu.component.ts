import { Component, Input, OnInit } from '@angular/core';
import { IconsService } from 'app/common/icons.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  @Input() latlng: number[];
  //@Input() mapId: string;
  icons;
  options = [
    {display: "Add Marker", function: this.onAddMarker(), active: true},
    {display: "Begin Line", function: this.onAddMarker(), active: false}
  ]  

  constructor(
    private iconsService: IconsService
  ) {
    this.icons = this.iconsService.getIcons();
  }

  ngOnInit(): void {
  }

  onAddMarker(): void {
    console.log('#contextMenuComponent -> onAddMarker() called');
  }

}
