import { local_cn } from '../utils/zh-CN.js'
import { 
  ClientSideRowModelModule,
  ModuleRegistry, 
  TextFilterModule, 
  ColumnAutoSizeModule, 
  LocaleModule, 
  QuickFilterModule, 
  TextEditorModule,
  provideGlobalGridOptions,
  TooltipModule,
  RenderApiModule,
  PinnedRowModule,
  RowStyleModule,
  RowAutoHeightModule,
  ScrollApiModule,
  AllCommunityModule
} from 'ag-grid-community';

import {
    SetFilterModule,
    LicenseManager, TreeDataModule
} from 'ag-grid-enterprise'

provideGlobalGridOptions({
  localeText: local_cn,
  stopEditingWhenCellsLoseFocus: true
})

ModuleRegistry.registerModules([
  ClientSideRowModelModule, 
  TextFilterModule, 
  ColumnAutoSizeModule, 
  LocaleModule, 
  QuickFilterModule, 
  TextEditorModule,
  SetFilterModule,
  TooltipModule,
  RenderApiModule,
  PinnedRowModule,
  RowStyleModule,
  RowAutoHeightModule,
  ScrollApiModule,
  AllCommunityModule,
    TreeDataModule
]);

LicenseManager.setLicenseKey('myWaterLicense')