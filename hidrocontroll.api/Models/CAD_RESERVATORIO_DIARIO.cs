//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace hidrocontroll.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class CAD_RESERVATORIO_DIARIO
    {
        public int IDC_CAD_RESERVATORIO_DIARIO { get; set; }
        public Nullable<System.DateTime> DAT_RESERVATORIO_DIARIO { get; set; }
        public Nullable<System.TimeSpan> TMO_INICIO { get; set; }
        public Nullable<System.TimeSpan> TMO_TERMINO { get; set; }
        public Nullable<double> VOL_RESERVATORIO_DIARIO { get; set; }
        public Nullable<double> VAR_CONSUMO { get; set; }
        public int CAD_RESERVATORIO_IDC_CAD_RESERVATORIO { get; set; }
        public int CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA { get; set; }
    
        public virtual CAD_MOTOBOMBA CAD_MOTOBOMBA { get; set; }
        public virtual CAD_RESERVATORIO CAD_RESERVATORIO { get; set; }
    }
}
