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
    public class PivoCentralController : BaseController
    {

        // GET api/Pivo
        public IQueryable<CAD_PIVO_CENTRAL> GetCAD_PIVO_CENTRAL()
        {
            return db.CAD_PIVO_CENTRAL;
        }

        // GET api/Pivo/5
        [ResponseType(typeof(CAD_PIVO_CENTRAL))]
        public IHttpActionResult GetCAD_PIVO_CENTRAL(int id)
        {
            CAD_PIVO_CENTRAL cad_pivo_central = db.CAD_PIVO_CENTRAL.Find(id);
            if (cad_pivo_central == null)
            {
                return NotFound();
            }

            return Ok(cad_pivo_central);
        }

        // PUT api/Pivo/5
        public IHttpActionResult PutCAD_PIVO_CENTRAL(int id, CAD_PIVO_CENTRAL cad_pivo_central)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_pivo_central.IDC_CAD_PIVO_CENTRAL)
            {
                return BadRequest();
            }

            db.Entry(cad_pivo_central).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_PIVO_CENTRALExists(id))
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

        // POST api/Pivo
        [ResponseType(typeof(CAD_PIVO_CENTRAL))]
        public IHttpActionResult PostCAD_PIVO_CENTRAL(CAD_PIVO_CENTRAL cad_pivo_central)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_PIVO_CENTRAL.Add(cad_pivo_central);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_pivo_central.IDC_CAD_PIVO_CENTRAL }, cad_pivo_central);
        }

        // DELETE api/Pivo/5
        [ResponseType(typeof(CAD_PIVO_CENTRAL))]
        public IHttpActionResult DeleteCAD_PIVO_CENTRAL(int id)
        {
            CAD_PIVO_CENTRAL cad_pivo_central = db.CAD_PIVO_CENTRAL.Find(id);
            if (cad_pivo_central == null)
            {
                return NotFound();
            }

            db.CAD_PIVO_CENTRAL.Remove(cad_pivo_central);
            db.SaveChanges();

            return Ok(cad_pivo_central);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_PIVO_CENTRALExists(int id)
        {
            return db.CAD_PIVO_CENTRAL.Count(e => e.IDC_CAD_PIVO_CENTRAL == id) > 0;
        }
    }
}