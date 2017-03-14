import { Component, Input, forwardRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ServiceOfferingFilterService } from '../shared/services/service-offering-filter.service';
import { ServiceOffering } from '../shared/models/service-offering.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: './service-offering-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceOfferingSelectorComponent),
      multi: true
    }
  ]
})
export class ServiceOfferingSelectorComponent implements ControlValueAccessor, OnChanges, OnInit {
  @Input() public zoneId: string;
  public serviceOfferings: Array<ServiceOffering>;
  private _serviceOffering: string;

  constructor(private serviceOfferingFilterService: ServiceOfferingFilterService) { }

  public ngOnInit(): void {
    this.fetchData({ zoneId: this.zoneId });
  }

  public propagateChange: any = () => {};

  @Input() public get serviceOffering(): string {
    return this._serviceOffering;
  }

  public set serviceOffering(value) {
    this._serviceOffering = value;
    this.propagateChange(value);
  }

  public writeValue(value): void {
    if (value) {
      this.serviceOffering = value;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!('zoneId' in changes)) {
      return;
    }
    const change = changes['zoneId'];
    if (change.currentValue !== change.previousValue) {
      this.fetchData({ zoneId: this.zoneId });
    }
  }

  private fetchData(params?: {}): void {
    this.serviceOfferingFilterService.getAvailable(params)
      .subscribe(availableOfferings => {
        this.serviceOfferings = availableOfferings;
        if (this.serviceOfferings.length) {
          this.serviceOffering = this.serviceOfferings[0].id;
        }
      });
  }
}
