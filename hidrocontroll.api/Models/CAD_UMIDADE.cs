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
    
    public partial class CAD_UMIDADE
    {
        public int IDC_CAD_UMIDADE { get; set; }
        public int CAD_PARCELA_IDC_CAD_PARCELA { get; set; }
        public Nullable<byte> VOL_CM10 { get; set; }
        public Nullable<byte> VOL_CM20 { get; set; }
        public Nullable<byte> VOL_CM30 { get; set; }
        public Nullable<byte> VOL_CM40 { get; set; }
        public Nullable<byte> VOL_CM50 { get; set; }
        public Nullable<byte> VOL_CM60 { get; set; }
        public System.DateTime DAT_UMIDADE { get; set; }
    
        public virtual CAD_PARCELA CAD_PARCELA { get; set; }
    }
}
