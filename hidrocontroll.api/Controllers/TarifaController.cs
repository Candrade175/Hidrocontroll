using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using hidrocontroll.Models;

namespace hidrocontroll.Controllers
{
    public class TarifaController : BaseController
    {

        // GET api/Tarifa
        public IQueryable<CAD_TARIFA> GetCAD_TARIFA()
        {
            return db.CAD_TARIFA;
        }

        // GET api/Tarifa/5
        [ResponseType(typeof(CAD_TARIFA))]
        public IHttpActionResult GetCAD_TARIFA(int id)
        {
            CAD_TARIFA cad_tarifa = db.CAD_TARIFA.Find(id);
            if (cad_tarifa == null)
            {
                return NotFound();
            }

            return Ok(cad_tarifa);
        }

        // PUT api/Tarifa/5
        public IHttpActionResult PutCAD_TARIFA(int id, CAD_TARIFA cad_tarifa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_tarifa.IDC_CAD_TARIFA)
            {
                return BadRequest();
            }


            if (!validaTarifa(cad_tarifa))
            {
                return BadRequest("Intervalo de tempo violado.");
            }

            db.Entry(cad_tarifa).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_TARIFAExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Tarifa
        [ResponseType(typeof(CAD_TARIFA))]
        public IHttpActionResult PostCAD_TARIFA(CAD_TARIFA cad_tarifa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!validaTarifa(cad_tarifa))
            {
                return BadRequest("Intervalo de tempo violado.");
            }
            db.CAD_TARIFA.Add(cad_tarifa);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_tarifa.IDC_CAD_TARIFA }, cad_tarifa);
        }

        // DELETE api/Tarifa/5
        [ResponseType(typeof(CAD_TARIFA))]
        public IHttpActionResult DeleteCAD_TARIFA(int id)
        {
            CAD_TARIFA cad_tarifa = db.CAD_TARIFA.Find(id);
            if (cad_tarifa == null)
            {
                return NotFound();
            }

            db.CAD_TARIFA.Remove(cad_tarifa);
            db.SaveChanges();

            return Ok(cad_tarifa);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_TARIFAExists(int id)
        {
            return db.CAD_TARIFA.Count(e => e.IDC_CAD_TARIFA == id) > 0;
        }

        private bool validaTarifa(CAD_TARIFA cad_tarifa)
        {
            hidrocontrollEntities db = new hidrocontrollEntities();
            db.Configuration.ProxyCreationEnabled = false;
            IQueryable<CAD_TARIFA> tarifas = db.CAD_TARIFA.Where(f => f.CAD_FAZENDA_IDC_CAD_FAZENDA == cad_tarifa.CAD_FAZENDA_IDC_CAD_FAZENDA);
            foreach (CAD_TARIFA t in tarifas)
            {
                if (t.IDC_CAD_TARIFA != cad_tarifa.IDC_CAD_TARIFA)
                {
                    if (verificaTimeEmIntervalo(cad_tarifa.HOR_INICIO_TARIFA.Value, t.HOR_INICIO_TARIFA.Value, t.HOR_FIM_TARIFA.Value)
                        || verificaTimeEmIntervalo(cad_tarifa.HOR_FIM_TARIFA.Value, t.HOR_INICIO_TARIFA.Value, t.HOR_FIM_TARIFA.Value))
                        return false;
                    if (verificaTimeEmIntervalo(t.HOR_INICIO_TARIFA.Value, cad_tarifa.HOR_INICIO_TARIFA.Value, cad_tarifa.HOR_FIM_TARIFA.Value)
                            || verificaTimeEmIntervalo(t.HOR_FIM_TARIFA.Value, cad_tarifa.HOR_INICIO_TARIFA.Value, cad_tarifa.HOR_FIM_TARIFA.Value))
                        return false;
                }
            }
            return true;
        }

        private bool verificaTimeEmIntervalo(TimeSpan time, TimeSpan timeInicio, TimeSpan timeFim)
        {
            if (time.CompareTo(timeInicio) >= 0 && time.CompareTo(timeFim) <= 0)
                return true;
            return false;
        }
    }
}