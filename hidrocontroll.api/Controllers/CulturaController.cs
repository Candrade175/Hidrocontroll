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
    public class CulturaController : BaseController
    {

        // GET api/Cultura
        public IQueryable<CAD_CULTURA> GetCAD_CULTURA()
        {

           
            return db.CAD_CULTURA;
        }

        // GET api/Cultura/5
        [ResponseType(typeof(CAD_CULTURA))]
        public IHttpActionResult GetCAD_CULTURA(int id)
        {
            CAD_CULTURA cad_cultura = db.CAD_CULTURA.Find(id);
            if (cad_cultura == null)
            {
                return NotFound();
            }

            return Ok(cad_cultura);
        }

        // PUT api/Cultura/5
        public IHttpActionResult PutCAD_CULTURA(int id, CAD_CULTURA cad_cultura)
        {

           
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_cultura.IDC_CAD_CULTURA)
            {
                return BadRequest();
            }

            db.Entry(cad_cultura).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_CULTURAExists(id))
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

        // POST api/Cultura
        [ResponseType(typeof(CAD_CULTURA))]
        public IHttpActionResult PostCAD_CULTURA(CAD_CULTURA cad_cultura)
        {
           
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.CAD_CULTURA.Add(cad_cultura);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CAD_CULTURAExists(cad_cultura.IDC_CAD_CULTURA))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = cad_cultura.IDC_CAD_CULTURA }, cad_cultura);
        }

        // DELETE api/Cultura/5
        [ResponseType(typeof(CAD_CULTURA))]
        public IHttpActionResult DeleteCAD_CULTURA(int id)
        {
            CAD_CULTURA cad_cultura = db.CAD_CULTURA.Find(id);
          
            if (cad_cultura == null)
            {
                return NotFound();
            }

            db.CAD_CULTURA.Remove(cad_cultura);
            db.SaveChanges();

            return Ok(cad_cultura);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_CULTURAExists(int id)
        {
            return db.CAD_CULTURA.Count(e => e.IDC_CAD_CULTURA == id) > 0;
        }
    }
}