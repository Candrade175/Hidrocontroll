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
    public class FaseCulturaController : BaseController
    {

        // GET api/FaseCultura
        public IQueryable<CAD_FASE_CULTURA> GetCAD_FASE_CULTURA()
        {
            return db.CAD_FASE_CULTURA;
        }

        // GET api/FaseCultura/5
        [ResponseType(typeof(CAD_FASE_CULTURA))]
        public IHttpActionResult GetCAD_FASE_CULTURA(int id)
        {
            CAD_FASE_CULTURA cad_fase_cultura = db.CAD_FASE_CULTURA.Find(id);
            if (cad_fase_cultura == null)
            {
                return NotFound();
            }

            return Ok(cad_fase_cultura);
        }

        // PUT api/FaseCultura/5
        public IHttpActionResult PutCAD_FASE_CULTURA(int id, CAD_FASE_CULTURA cad_fase_cultura)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_fase_cultura.IDC_CAD_FASE_CULTURA)
            {
                return BadRequest();
            }

            db.Entry(cad_fase_cultura).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_FASE_CULTURAExists(id))
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

        // POST api/FaseCultura
        [ResponseType(typeof(CAD_FASE_CULTURA))]
        public IHttpActionResult PostCAD_FASE_CULTURA(CAD_FASE_CULTURA cad_fase_cultura)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_FASE_CULTURA.Add(cad_fase_cultura);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_fase_cultura.IDC_CAD_FASE_CULTURA }, cad_fase_cultura);
        }

        // DELETE api/FaseCultura/5
        [ResponseType(typeof(CAD_FASE_CULTURA))]
        public IHttpActionResult DeleteCAD_FASE_CULTURA(int id)
        {
            CAD_FASE_CULTURA cad_fase_cultura = db.CAD_FASE_CULTURA.Find(id);
            if (cad_fase_cultura == null)
            {
                return NotFound();
            }

            db.CAD_FASE_CULTURA.Remove(cad_fase_cultura);
            db.SaveChanges();

            return Ok(cad_fase_cultura);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_FASE_CULTURAExists(int id)
        {
            return db.CAD_FASE_CULTURA.Count(e => e.IDC_CAD_FASE_CULTURA == id) > 0;
        }
    }
}