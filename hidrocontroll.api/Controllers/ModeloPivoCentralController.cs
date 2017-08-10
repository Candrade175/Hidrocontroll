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
    public class ModeloPivoCentralController : BaseController
    {
        // GET api/ModeloPivo
        public IQueryable<CAD_MODELO_PIVO_CENTRAL> GetCAD_MODELO_PIVO_CENTRAL()
        {
            return db.CAD_MODELO_PIVO_CENTRAL;
        }

        // GET api/ModeloPivo/5
        [ResponseType(typeof(CAD_MODELO_PIVO_CENTRAL))]
        public IHttpActionResult GetCAD_MODELO_PIVO_CENTRAL(int id)
        {
            CAD_MODELO_PIVO_CENTRAL cad_modelo_pivo = db.CAD_MODELO_PIVO_CENTRAL.Find(id);
            if (cad_modelo_pivo == null)
            {
                return NotFound();
            }

            return Ok(cad_modelo_pivo);
        }

        // PUT api/ModeloPivo/5
        public IHttpActionResult PutCAD_MODELO_PIVO_CENTRAL(int id, CAD_MODELO_PIVO_CENTRAL cad_modelo_pivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_modelo_pivo.IDC_CAD_MODELO_PIVO_CENTRAL)
            {
                return BadRequest();
            }

            db.Entry(cad_modelo_pivo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_MODELO_PIVO_CENTRALExists(id))
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

        // POST api/ModeloPivo
        [ResponseType(typeof(CAD_MODELO_PIVO_CENTRAL))]
        public IHttpActionResult PostCAD_MODELO_PIVO_CENTRAL(CAD_MODELO_PIVO_CENTRAL cad_modelo_pivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_MODELO_PIVO_CENTRAL.Add(cad_modelo_pivo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_modelo_pivo.IDC_CAD_MODELO_PIVO_CENTRAL }, cad_modelo_pivo);
        }

        // DELETE api/ModeloPivo/5
        [ResponseType(typeof(CAD_MODELO_PIVO_CENTRAL))]
        public IHttpActionResult DeleteCAD_MODELO_PIVO_CENTRAL(int id)
        {
            CAD_MODELO_PIVO_CENTRAL cad_modelo_pivo = db.CAD_MODELO_PIVO_CENTRAL.Find(id);
            if (cad_modelo_pivo == null)
            {
                return NotFound();
            }

            db.CAD_MODELO_PIVO_CENTRAL.Remove(cad_modelo_pivo);
            db.SaveChanges();

            return Ok(cad_modelo_pivo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_MODELO_PIVO_CENTRALExists(int id)
        {
            return db.CAD_MODELO_PIVO_CENTRAL.Count(e => e.IDC_CAD_MODELO_PIVO_CENTRAL == id) > 0;
        }
    }
}