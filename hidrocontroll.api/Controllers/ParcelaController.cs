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
    public class ParcelaController : BaseController
    {

        // GET api/Parcela
        public IQueryable<CAD_PARCELA> GetCAD_PARCELA()
        {
            return db.CAD_PARCELA;
        }

        // GET api/Parcela/5
        [ResponseType(typeof(CAD_PARCELA))]
        public IHttpActionResult GetCAD_PARCELA(int id)
        {
            CAD_PARCELA cad_parcela = db.CAD_PARCELA.Find(id);
            if (cad_parcela == null)
            {
                return NotFound();
            }

            return Ok(cad_parcela);
        }

        // PUT api/Parcela/5
        public IHttpActionResult PutCAD_PARCELA(int id, CAD_PARCELA cad_parcela)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_parcela.IDC_CAD_PARCELA)
            {
                return BadRequest();
            }

            db.Entry(cad_parcela).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_PARCELAExists(id))
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

        // POST api/Parcela
        [ResponseType(typeof(CAD_PARCELA))]
        public IHttpActionResult PostCAD_PARCELA(CAD_PARCELA cad_parcela)
        {
            System.IO.StreamWriter file = new System.IO.StreamWriter("C:\\test.txt");
            file.WriteLine("1");

            if (!ModelState.IsValid)
            {
                file.WriteLine("2");
                file.Close();
                return BadRequest(ModelState);
            }

            file.Close();

            db.CAD_PARCELA.Add(cad_parcela);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CAD_PARCELAExists(cad_parcela.IDC_CAD_PARCELA))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = cad_parcela.IDC_CAD_PARCELA }, cad_parcela);
        }

        // DELETE api/Parcela/5
        [ResponseType(typeof(CAD_PARCELA))]
        public IHttpActionResult DeleteCAD_PARCELA(int id)
        {
            CAD_PARCELA cad_parcela = db.CAD_PARCELA.Find(id);
            if (cad_parcela == null)
            {
                return NotFound();
            }

            db.CAD_PARCELA.Remove(cad_parcela);
            db.SaveChanges();

            return Ok(cad_parcela);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_PARCELAExists(int id)
        {
            return db.CAD_PARCELA.Count(e => e.IDC_CAD_PARCELA == id) > 0;
        }
    }
}